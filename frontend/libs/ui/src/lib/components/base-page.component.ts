import {
  ComponentRef,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  AfterContentInit,
  Type,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  LogRow,
  Action,
  ItemResult,
  ItemThemeType,
  ItemUsage,
} from '@diggel/data';
import { ToastrService } from 'ngx-toastr';
import { CordovaService } from './../services/cordova.service';
import { SearchService } from './../services/search.service';
import { tap, delay, filter, mergeMap } from 'rxjs/operators';
import { of, Subscription, BehaviorSubject, from } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from './../services/backend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { restartApp } from '@diggel/data';
import { UserService } from './../services/user.service';
import { ItemComponent } from './item.component';
import { ItemDefinition } from '../model';

@Component({
  selector: 'diggel-base',
  template: `SHOULD BE OVERRIDDEN`,
})
export abstract class BasePageComponent implements AfterContentInit, OnDestroy {
  public itemDefinitions: ItemDefinition[] = []; // item definitions, show be overridden and point to the right items.ts for the project
  public theme: ItemThemeType; // item with this theme are answered in the page
  public placement: 'first' | 'lastOrPlaced' | 'firstOrPlaced' = 'lastOrPlaced'; // place a new item on top of the div
  // define if items from other themes should be loaded in readonly mode too. 
  // e.g. to be able to have a feed, show something else and return to the feed.
  public showOtherThemesInFeed: Array<ItemThemeType> = [];
  public singleItemMode = false; // show one item a time, or show previous answered items in read only mode too.
  public logging: LogRow[];
  public sequenceNumber = 0;
  public onCordova: boolean;
  public componentRef: ComponentRef<ItemComponent>;
  public currentItem: ItemComponent;
  public currentItemDef: ItemDefinition;
  public notificationMessage =
    '<span class="h5">😱</span> Je hebt mijn vraag nog niet helemaal beantwoord.';
  protected placedComponents = new Map<string, HTMLElement>();
  private onEndUrl = 'end';
  private nextSubscription: Subscription;
  private routeSubscription: Subscription;
  private logSubscription: Subscription;
  private searchSubscription: Subscription;
  private startLogicSubscription: Subscription;
  private afterContentInit = false;
  private componentLookupRegistry: Map<string, Type<ItemComponent>> = new Map();
  itemInstances: Array<ItemComponent> = [];
  @ViewChild('modalContent', { static: true }) modalContent: ViewContainerRef;
  @ViewChild('itemContainer', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  constructor(
    public toastr: ToastrService,
    private cordovaService: CordovaService,
    private modalService: NgbModal,
    private searchService: SearchService,
    private backendService: BackendService,
    private resolver: ComponentFactoryResolver,
    private router: Router,

    public userService: UserService,
    protected ref: ChangeDetectorRef,
    route: ActivatedRoute
  ) {
    this.onCordova = this.cordovaService.onCordova;
    this.searchSubscription = this.searchService.logStream.subscribe((log) => {
      if (log !== null && this.currentItem) {
        this.backendService.addLog(this.currentItem.id, log);
      }
    });
    this.routeSubscription = route.params.subscribe((params) => {
      // container is available after ngAfterContentInit
      // before itemcomponents can't be added to the container.
      this.modalService.dismissAll();
      const newSequenceNumber = +params.sequenceNumber;
      if (newSequenceNumber < this.sequenceNumber) {
        window.location.reload();
      }
      this.sequenceNumber = +params.sequenceNumber;
      if (this.afterContentInit) {
        this.setItemComponentsInContainer();
      }
    });
  }

  ngAfterContentInit(): void {
    this.afterContentInit = true;
    this.setItemComponentsInContainer();
  }

  private async setItemComponentsInContainer() {
    let nextItem = null;
    if (this.singleItemMode) {
      nextItem = this.itemDefinitions
        .filter((i) => i.type === this.theme)
        .find((i) => i.sequenceNumber === this.sequenceNumber);
      // clear container and add next item.
      this.container.clear();
      this.itemInstances = [await this.createComponent(nextItem)];
    } else {
      // get all items before routeIndex
      const pageItems = this.itemDefinitions.filter(
        (i) => i.type === this.theme
      );
      const otherItemsToShow = this.itemDefinitions.filter((i) =>
        this.showOtherThemesInFeed.includes(i.type)
      );
      let items = [...otherItemsToShow, ...pageItems].filter(
        (_, index) => index < this.sequenceNumber + otherItemsToShow.length
      );
      nextItem = items[items.length - 1];
      // filter info items
      items = items.filter(
        (i) => i.usage !== ItemUsage.info || i.id === nextItem.id
      );
      // remove items that should be shown.
      this.itemInstances.forEach((item) => {
        if (!items.find((i) => i.id === item.id)) {
          if (!this.removeItem(item.id)) {
            this.container.remove(0);
          }
        }
      });
      // filter them from itemComponents
      this.itemInstances = this.itemInstances.filter(
        (item) => !!items.find((i) => i.id === item.id)
      );
      // create new items
      for (const item of items) {
        const existingComponent = this.itemInstances.find(
          (i) => i.id === item.id
        );
        if (!existingComponent) {
          const itemComponent = await this.createComponent(item);
          this.itemInstances.push(itemComponent);
        } else {
          existingComponent.readonly = true;
        }
      }
    }
    // subscibe to log and response events
    await this.setCurrentItem(nextItem);
  }

  protected removeItem(id: string) {
    const el = this.placedComponents.get(id);
    if (el) {
      el.remove();
      return true;
    }
    return false;
  }

  protected afterItemComponentAdded(
    itemComponent: ComponentRef<ItemComponent>,
    item: ItemDefinition
  ) {
    // can be overridden to place item
    const itemElement = itemComponent.location.nativeElement;
    const location = item.location || item.id;
    const container: HTMLElement = document.querySelector(`#${location}`);
    if (container) {
      const existingComp = this.placedComponents.get(location);
      existingComp?.remove();
      this.placedComponents.set(location, itemElement);
      container.append(itemElement);
    }
  }

  async createComponent(item: ItemDefinition): Promise<ItemComponent> {
    const component = await this.getItemComponent(item);

    const factory = this.resolver.resolveComponentFactory(component);
    const itemComponent =
      this.placement == 'first' ||
        (this.placement == 'firstOrPlaced' &&
          !document.querySelector(`#${item.location || item.id}`))
        ? this.container.createComponent(factory, 0)
        : this.container.createComponent(factory);

    setTimeout(() => this.afterItemComponentAdded(itemComponent, item), 100); //setTimeout to be able to give binding time..
    const instance = itemComponent.instance;
    // restore result
    const restoredItemResult =
      this.userService.testSession && this.userService.testSession?.itemResults
        ? this.userService.testSession?.itemResults.find(
          (i) => i.id === item.id
        )
        : undefined;
    instance.readonly = true;
    if (restoredItemResult !== undefined) {
      instance.setInitialValue(restoredItemResult);
    }
    return instance;
  }

  beforeGoToNextItem() {
    if (!this.currentItem.loading) {
      if (this.startLogicSubscription) {
        this.startLogicSubscription.unsubscribe();
      }
      this.toastr.clear();
      this.currentItem.loading = true;
      // observable with array of 1 to start chain
      return of([1]).pipe(
        delay(1000),
        mergeMap(() => {
          if (this.currentItemDef.usage === ItemUsage.info) {
            return from(this.sendResponseAndEndItem(null));
          } else {
            const itemResult = this.currentItem.getResult();
            if (!itemResult.feedback) {
              this.toastr.clear();
              return from(this.open(this.modalContent, itemResult));
              // this.showNotification(this.notificationMessage);
            } else {
              if (!itemResult || itemResult.responses.length === 0) {
                console.error('no responses!');
              }
              return from(this.sendResponseAndEndItem(itemResult));
            }
          }
        })
      );
    }
  }

  async sendResponseAndEndItem(itemResult: ItemResult) {
    if (!itemResult || itemResult.responses.length == 0) {
      this.endItem(itemResult);
      return Promise.resolve();
    } else {
      await this.backendService.storeItemResult(itemResult).pipe(
        tap(() => this.endItem(itemResult))).toPromise();
    }
  }

  endItem(itemResult: ItemResult) {
    this.searchService.stop(); // stop and TODO: get results
    this.currentItem.loading = true;
    this.currentItem.readonly = true;
    if (this.currentItemDef.usage === ItemUsage.info) {
      this.currentItem.onNext.complete();
      this.currentItem.loading = false;
      this.router.navigate([this.getRouteNextStep()]);
    } else {
      of([1])
        .pipe(
          tap(() => {
            if (!itemResult.feedback) {
              this.showNotification('Ok, dan gaan we verder!');
            } else {
              this.showNotification(itemResult.feedback);
            }
          }),
          delay(2500),
          tap(() => {
            // complete behaviour subjects so it doesnt give problems when
            // subscribing again.
            this.currentItem.logStream.complete();
            this.currentItem.onNext.complete();
            this.currentItem.loading = false;
            this.router.navigate([this.getRouteNextStep()]);
          })
        )
        .subscribe();
    }
  }

  getRouteNextStep() {
    const currentIndex = this.itemDefinitions.findIndex(
      (c) => c.id === this.currentItem.id
    );
    const nextItem =
      currentIndex >= this.itemDefinitions.length
        ? null
        : this.itemDefinitions[currentIndex + 1];
    return nextItem
      ? `${ItemThemeType[nextItem.type]}/${nextItem.sequenceNumber.toString()}`
      : this.onEndUrl;
  }

  startItem(directFeedback = false) {
    this.startLogicSubscription = of([1])
      .pipe(
        delay(directFeedback ? 0 : 1000),
        tap(() => {
          this.toastr.clear();
        }),
        delay(1000),
        tap(() => {
          this.showNotification(
            this.currentItem.getNotification(),
            this.currentItem.id
          );
        })
      )
      .subscribe();
  }

  showNotification(message: string, id = '', myTimeOut = 0) {
    this.toastr.info(message, id, {
      timeOut: myTimeOut,
      enableHtml: true,
      toastClass: id,
      closeButton: false,
      tapToDismiss: false,
      disableTimeOut: true,
    });
  }

  async open(content, itemResult: ItemResult) {
    try {
      const modalResult = await this.modalService.open(content, {
        // windowClass: 'modal-animate',
        windowClass: 'modal-toaster',
        ariaLabelledBy: 'modal-basic-title',
      }).result;
      if (modalResult === 'Cancel') {
        this.currentItem.loading = false;
        this.currentItem.readonly = false;
        this.startItem(true);
      }
      if (modalResult === 'Next') {
        this.toastr.clear();
        await this.sendResponseAndEndItem(itemResult);
      }
    } catch (reason) {
      if (
        reason === ModalDismissReasons.ESC ||
        // PdK: Cross click is not an enum member, but we have to check for it
        // Because else the button keeps on loading
        reason === 'Cross click' ||
        reason === ModalDismissReasons.BACKDROP_CLICK
      ) {
        this.currentItem.loading = false;
        this.currentItem.readonly = false;
        this.startItem(true);
      }
    }
  }
  public restartApp = () => restartApp(this.cordovaService.onCordova);

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.startLogicSubscription) {
      this.startLogicSubscription.unsubscribe();
    }
  }
  private async getItemComponent(item: ItemDefinition) {
    if (!this.componentLookupRegistry.get(item.id)) {
      const module = await item.component;
      const itemComponent = module[Object.keys(module)[0]];
      if (!itemComponent) {
        throw Error(`Could not find component for: ${item.id}`);
      }
      this.componentLookupRegistry.set(item.id, itemComponent);
    }
    return this.componentLookupRegistry.get(item.id);
  }
  private setCurrentItem(currentItemDef: ItemDefinition) {
    if (this.nextSubscription) {
      this.nextSubscription.unsubscribe();
    }
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
    this.currentItemDef = currentItemDef;
    this.currentItem = this.itemInstances[this.itemInstances.length - 1];
    this.currentItem.onNext = new BehaviorSubject(null);
    this.nextSubscription = this.currentItem.onNext
      .pipe(
        filter((value) => value),
        mergeMap(() => this.beforeGoToNextItem())
      )
      .subscribe();
    if (currentItemDef && currentItemDef.usage !== ItemUsage.info) {
      this.backendService.addLog(this.currentItem.id, {
        action: Action.itemStarted,
        content: this.currentItem.id,
        timestamp: new Date(),
      });
    }
    this.logSubscription = this.currentItem.logStream.subscribe((log) => {
      if (currentItemDef && currentItemDef.usage !== ItemUsage.info) {
        this.backendService.addLog(this.currentItem.id, log);
      }
    });
    this.currentItem.readonly = false;
    this.startItem();
  }

  get time() {
    return new Date(Date.now()).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

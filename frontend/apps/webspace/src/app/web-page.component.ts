import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchService,
  CordovaService,
  BackendService,
  UserService,
} from '@diggel/ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HeaderBoldComponent } from './items/header/header.bold.component';
import { MenuComponent } from './items/menu/menu.component';
import { BannerComponent } from './items/banner/banner.component';
import { itemBanner, itemMenu, itemHeaderBold } from './items/items';
import { WebspaceBaseComponent } from './webspace-base.component';

@Component({
  selector: 'diggel-web-page',
  template: 'NO HTML HERE',
})
export class WebPageComponent
  extends WebspaceBaseComponent
  implements AfterViewInit {
  @ViewChild('banner') bannerComponent: BannerComponent;
  @ViewChild('header') HeaderComponent: HeaderBoldComponent;
  @ViewChild('menu') menuComponent: MenuComponent;

  constructor(
    public toastr: ToastrService,
    cordovaService: CordovaService,
    modalService: NgbModal,
    searchService: SearchService,
    backendService: BackendService,
    resolver: ComponentFactoryResolver,
    router: Router,
    userService: UserService,
    ref: ChangeDetectorRef,
    route: ActivatedRoute
  ) {
    super(
      toastr,
      cordovaService,
      modalService,
      searchService,
      backendService,
      resolver,
      router,
      userService,
      ref,
      route
    );
  }

  ngAfterViewInit(): void {
    if (this.userService.testSession?.itemResults) {
      this.bannerComponent.setInitialValue(
        this.userService.testSession?.itemResults.find(
          (i) => i.id === itemBanner
        )
      );
      this.menuComponent.setInitialValue(
        this.userService.testSession?.itemResults.find((i) => i.id === itemMenu)
      );
      this.HeaderComponent.setInitialValue(
        this.userService.testSession?.itemResults.find(
          (i) => i.id === itemHeaderBold
        )
      );
      this.ref.detectChanges();
    }
  }
}

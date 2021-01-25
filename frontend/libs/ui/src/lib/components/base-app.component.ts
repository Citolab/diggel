import { Component, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { CordovaService } from './../services/cordova.service';
import { UserService } from './../services/user.service';
import { ItemThemeType } from '@diggel/data';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ItemDefinition } from '../model';

export class ScoredItemDefinition extends ItemDefinition {
  score: string;
  response: string;
}
// TODO: Add Angular decorator.
@Component({
  selector: 'diggel-base',
  template: `SHOULD BE OVERRIDDEN`,
})
export abstract class AppBaseComponent implements OnDestroy {
  public cordova = true;
  public development = false;
  public allowNavigation = false;
  public scoredItems: ScoredItemDefinition[];
  private queryParamSubscription: Subscription;
  private answeredSubscription: Subscription;
  private testSessionLoadedSubscription: Subscription;

  set items(itms: ItemDefinition[]) {
    this.scoredItems = itms.map((item) => {
      const { response, score } = this.getResponseAndScore(item);
      return {
        ...item,
        response,
        score,
      };
    });
  }
  constructor(
    cordovaService: CordovaService,
    public userService: UserService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.cordova = cordovaService.onCordova;
    this.development = !environment.production;

    this.queryParamSubscription = this.route.queryParams
      .pipe(
        filter((q) => !!q.lastItem),
        // take(1),
        map((q) => q.lastItem)
      )
      .subscribe((lastItem) => {
        if (lastItem) {
          const lastIndex = this.scoredItems?.findIndex(
            (i) => i.id === lastItem
          );
          const item = this.scoredItems?.find(
            (_, index) => index === lastIndex + 1
          );
          if (item) {
            this.routeToItem(item);
          } else {
            this.routeToEnd();
          }
        }
      });
    this.testSessionLoadedSubscription = userService.testSessionLoaded
      .asObservable()
      .subscribe(async () => {
        const isLoggedIn = await this.userService.isLoggedIn().toPromise();
        this.allowNavigation =
          (!this.cordova || userService.testSession.isDemoTestSession) &&
          isLoggedIn;
        this.scoredItems = this.scoredItems?.map((item) => {
          const { response, score } = this.getResponseAndScore(item);
          return {
            ...item,
            response,
            score,
          };
        });
        if (this.allowNavigation && !this.answeredSubscription) {
          this.answeredSubscription = userService.itemAnswered
            .asObservable()
            .subscribe((itemId) => {
              this.scoredItems = this.scoredItems.map((item) => {
                if (itemId === item.id) {
                  const { response, score } = this.getResponseAndScore(item);
                  return {
                    ...item,
                    response,
                    score,
                  };
                }
                return item;
              });
            });
        }
      });
  }
  ngOnDestroy(): void {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
    if (this.answeredSubscription) {
      this.answeredSubscription.unsubscribe();
    }
    if (this.testSessionLoadedSubscription) {
      this.testSessionLoadedSubscription.unsubscribe();
    }
  }

  isActive(item: ItemDefinition) {
    const url = window.location.href.split('/');
    if (url.length >= 2) {
      const sequence = +url[url.length - 1];
      const type = url[url.length - 2];
      return (
        item.sequenceNumber === sequence && ItemThemeType[item.type] === type
      );
    }
    return false;
  }

  routeToItem(item: ItemDefinition) {
    this.router.navigate([
      `${ItemThemeType[item.type]}/${item.sequenceNumber}`,
    ]);
  }

  routeToEnd() {
    this.router.navigate([`/end`]);
  }

  getResponseAndScore(item: ItemDefinition) {
    if (this.userService.testSession?.itemResults) {
      const results = this.userService.testSession?.itemResults;
      const itemResult = results.find((r) => r.id === item.id);
      if (itemResult) {
        return {
          response: itemResult.responses
            .map((r) => this.truncate(r.readableValue || r.value, 8))
            .join('&'),
          score: itemResult.responses.map((r) => r.score).join('&'),
        };
      }
    }
    return {
      response: null,
      score: null,
    };
  }

  private truncate = (value: string, length: number) =>
    value && value.length > length ? value.substring(0, length) + '...' : value;
}

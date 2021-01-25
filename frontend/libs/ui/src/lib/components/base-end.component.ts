import { OnInit, OnDestroy, Component, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { timer, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { CordovaService } from '../services/cordova.service';
import { BackendService } from '../services/backend.service';
import { SearchService } from '../services/search.service';
import { restartApp } from '@diggel/data';

@Component({
  selector: 'diggel-end-base',
  template: ``
})
export abstract class BaseEndPageComponent implements OnInit, OnDestroy {
  resultButtonClicked = false;
  textSessionReady =
    'Bedankt voor je hulp! Ik kan Spacebook nu zelf gebruiken.';
  endSubscription: Subscription;
  openedSurvey = false;
  isLast = false;
  private endButtonClicked = false;
  constructor(
    private userService: UserService,
    public toastr: ToastrService,
    private cordovaService: CordovaService,
    private backendService: BackendService,
    private searchService: SearchService,
    private ref: ChangeDetectorRef
  ) {
    toastr.clear();
  }
  ngOnDestroy(): void {
    if (this.endSubscription) {
      this.endSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    const result = await this.backendService.finish().toPromise();
    if (result.testSessionViewModel) {
      this.isLast = false;
    } else {
      this.isLast = true;
    }
    this.userService.testSession = result.testSessionViewModel || this.userService.testSession;
    this.endSubscription = timer(1000)
      .pipe(take(1))
      .subscribe(() => {
        if (!this.isLast) {
          this.showNotification(`${this.textSessionReady} 
                    Klik op verder om de volgende opdracht te starten`);
        } else {
          this.showNotification(`${this.textSessionReady} 
                    Dit is het eind van de toets. Er komt nog een korte vragenlijst. Bedankt voor het meedoen!`);
        }
      });
  }


  toSurvey() {
    const url = this.userService.toetsvragen_list.get(this.userService?.testSession?.testModuleId);
    this.searchService.search(
      `${url}?code=${this.userService.testSession.startCode}`,
      this.openedSurvey
    );
    this.openedSurvey = true;
    this.ref.detectChanges();
  }

  async finish() {
    if (!this.endButtonClicked) {
      this.endButtonClicked = true;
      this.backendService.signout().subscribe(() => {
        restartApp(this.cordovaService.onCordova);
      });
    }
  }

  next() {
    this.toastr.clear();
    this.resultButtonClicked = true;
    this.userService.fullRefreshToSessionApplication(this.cordovaService.onCordova);
  }

  showNotification(message: string, id = '', myTimeOut = 0) {
    this.toastr.info(message, id, {
      timeOut: myTimeOut,
      enableHtml: true,
      closeButton: false,
      tapToDismiss: false,
      disableTimeOut: true,
    });
  }
}

import { OnInit, OnDestroy, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { timer, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { CordovaService } from '../services/cordova.service';
import { BackendService } from '../services/backend.service';
import { restartApp } from '@diggel/data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'diggel-end-base',
  template: ``
})
export abstract class BaseEndPageComponent implements OnInit, OnDestroy {
  resultButtonClicked = false;
  textSessionReady = '';
  endSubscription: Subscription;
  isLast = false;
  public lang = this.translate.currentLang;
  private endButtonClicked = false;
  constructor(
    private userService: UserService,
    public toastr: ToastrService,
    private cordovaService: CordovaService,
    private backendService: BackendService,
    protected translate: TranslateService
  ) {
    toastr.clear();
    translate.setTranslation('en', {
      DIGGEL_END_THANKS: `Thanks! Now I use Spacebook myself.`,
      DIGGEL_NEXT_SESSION: `Click 'next' to start the next digital environment.`,
      DIGGEL_END: `This is the end, thanks for helping!`
    });
    translate.setTranslation('nl', {
      DIGGEL_END_THANKS: `Bedankt voor je hulp! Ik kan Spacebook nu zelf gebruiken.`,
      DIGGEL_NEXT_SESSION: `Klik op verder om de volgende opdracht te starten`,
      DIGGEL_END: `Dit is het eind van de toets. Bedankt voor het meedoen!`
    });
    this.textSessionReady = translate.instant('DIGGEL_END_THANKS');
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
        this.showNotification(this.textSessionReady + ' ' + 
        this.translate.instant(this.isLast ? 'DIGGEL_END' : 'DIGGEL_NEXT_SESSION'));
      });
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

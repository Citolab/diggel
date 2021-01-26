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
    this.textSessionReady = translate.instant('SPACEBOOK_END_THANKS`,');
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

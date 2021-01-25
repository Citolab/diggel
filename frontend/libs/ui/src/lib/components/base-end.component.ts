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
    'Thanks! Now I can use Spacebook myself.';
  endSubscription: Subscription;
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
                    Click 'next' to start the next digital environment.`);
        } else {
          this.showNotification(`${this.textSessionReady} 
                    This is the end, thanks for helping!`);
        }
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

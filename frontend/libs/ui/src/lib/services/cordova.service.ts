import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { environment } from 'environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class CordovaService implements OnDestroy {
  private eventSubscription: Subscription;
  private resume: BehaviorSubject<boolean>;

  constructor(private zone: NgZone) {
    this.resume = new BehaviorSubject<boolean>(null);
    if (this.onCordova) {
      //screen.orientation.lock('landscape'); removed because of crash
    }
    this.eventSubscription = fromEvent(document, 'resume').subscribe(() => {
      this.zone.run(() => {
        this.onResume();
      });
    });
    this.eventSubscription = fromEvent(document, 'deviceready').subscribe(
      () => {
        console.log('device ready');
        document.addEventListener(
          'backbutton',
          (e) => e.preventDefault(),
          false
        );
      }
    );
  }
  public checkUpdate() {
    if (this.onCordova) {
      const appUpdate = this.cordova.require(
        'cordova-plugin-app-update.AppUpdate'
      );
      appUpdate.checkAppUpdate(
        this.onSuccess,
        this.onFail,
        environment.updateUrl,
        { skipPromptDialog: true }
      );
    }
  }

  public screenLandscape() {
    if (this.onCordova) {
      screen.orientation.lock('landscape');
    }
  }

  private onSuccess = () => {
    console.log('checked for new version');
  };
  private onFail = () => {
    console.log('failed to check for new version');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get cordova(): any {
    return _window().cordova;
  }

  get onCordova(): boolean {
    return !!_window().cordova;
  }

  public onResume(): void {
    this.resume.next(true);
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}

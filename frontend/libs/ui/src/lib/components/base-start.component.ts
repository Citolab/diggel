import { OnInit, OnDestroy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { ItemThemeType, setLocalSession } from '@diggel/data';
import { UserService } from '../services/user.service';
import { ItemDefinition } from '../model';

@Component({
  selector: 'diggel-start-base',
  template: ``
})
export abstract class BaseStartPageComponent implements OnInit, OnDestroy {
  private startedClicked = false;
  private chain: Subscription;
  private testSessionSubscription: Subscription;

  protected welcomeMessage = '';
  protected firstItem: ItemDefinition;

  constructor(
    public toastr: ToastrService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    // Here the localStorage for demo sessions is clear.
    // This because locally all applications run on a different port and localstorage is used
    // to restore results when refreshing the application.
    if (this.userService.testSession) {
      this.setupSession();
    } else {
      this.testSessionSubscription = this.userService.testSessionLoaded.subscribe(
        () => {
          this.setupSession();
        }
      );
    }

    this.chain = timer(2000).subscribe(() => {
      this.showNotification(this.welcomeMessage);
    });
  }

  setupSession() {
    if (
      this.userService.testSession.isDemoTestSession
    ) {
      this.userService.testSession = {
        ...this.userService.testSession,
        itemResults: [],
      };
      setLocalSession(
        this.userService.testSession.id,
        this.userService.testSession
      );
    }
  }

  ngOnDestroy(): void {
    if (this.chain) {
      this.chain.unsubscribe();
    }
    if (this.testSessionSubscription) {
      this.testSessionSubscription.unsubscribe();
    }
  }

  start() {
    if (!this.startedClicked) {
      this.startedClicked = true;
      this.router.navigate([
        `${ItemThemeType[this.firstItem.type]}/${this.firstItem.sequenceNumber
        }`,
      ]);
    }
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

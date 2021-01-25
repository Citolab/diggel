import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  HostListener,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';
import { SearchService } from './../../services/search.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[diggel-toast-component]',
  styleUrls: ['notification.component.scss'],
  templateUrl: 'notification.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('flyInOut', [
      state(
        'inactive',
        style({
          opacity: 0,
        })
      ),
      transition(
        'inactive => active',
        animate(
          '400ms ease-out',
          keyframes([
            style({
              transform: 'translate3d(0, -100%, 0)',
              opacity: 0,
            }),
            style({
              transform: 'translate3d(0%, 0, 0)',
              opacity: 1,
            }),
          ])
        )
      ),
      transition(
        'active => removed',
        animate(
          '400ms ease-out',
          keyframes([
            style({
              opacity: 1,
            }),
            style({
              transform: 'translate3d(0, -100%, 0)',
              opacity: 0,
            }),
          ])
        )
      ),
    ]),
  ],
  preserveWhitespaces: false,
})
export class ChatToastComponent extends Toast {
  // used for demo purposes
  undoString = 'undo';
  time: string;
  searchOpened = false;
  @HostBinding('class.toast') toast = true;

  @HostListener('click', ['$event']) onClick(e: Event) {
    if ((e?.target as HTMLAnchorElement)?.tagName.toLowerCase() === 'a') {
      e.preventDefault();
      const anchor = e.target as HTMLAnchorElement;
      this.searchService.search(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e.target as any).href,
        this.searchOpened && anchor.target !== '_blank'
      );
      this.searchOpened = true;
    }
  }
  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    public searchService: SearchService
  ) {
    super(toastrService, toastPackage);
    this.time = this.getTime();
    this.searchOpened = false;
  }

  private getTime = () =>
    new Date(Date.now()).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
}

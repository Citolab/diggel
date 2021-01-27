import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { slideIn } from '@diggel/ui';

@Component({
  selector: 'diggel-item-header',
  animations: [slideIn],
  templateUrl: `item-header.component.html`,
  styles: [
    `
      @keyframes shadow-pulse {
        0% {
          box-shadow: 0 0 0 0px #d65db29c;
        }
        100% {
          box-shadow: 0 0 0 12px #d65db200;
        }
      }

      .pulse {
        animation: shadow-pulse 1s infinite;
      }
    `,
  ],
})
export class ItemHeaderComponent implements OnChanges {
  imgSrc: string;
  @Input() name: string;
  @Input() loading: boolean;
  @Input() readonly: boolean;
  // @Input() small = false;
  @Input() profileButton = false;

  @Output() clickProfile = new EventEmitter<boolean>();
  time: string;

  constructor() {
    this.time = this.getTime();
  }

  ngOnChanges(): void {
    if (this.name) {
      this.imgSrc =
        this.name === 'Susan'
          ? `assets/profile-pics/shutterstock_1257452734.png`
          : `assets/profile-pics-feed/${this.name}.png`;
    } else {
      this.imgSrc = 'assets/profile-pics/profile-empty.png';
    }
  }

  private getTime = () =>
    new Date(Date.now()).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
}

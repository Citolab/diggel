import { Component, Input, OnChanges } from '@angular/core';
import { slideIn } from '@diggel/ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'diggel-item-header',
  animations: [slideIn],
  templateUrl: `item-header.component.html`,
  styles: [``],
})
export class ItemHeaderComponent implements OnChanges {
  imgSrc: string;
  @Input() name: string;
  @Input() loading: boolean;
  @Input() readonly: boolean;
  @Input() small = false;
  time: string;

  constructor(public translate: TranslateService) {
    this.time = this.getTime();
  }

  ngOnChanges(): void {
    if (this.name) {
      this.imgSrc =
        this.name === 'Susan'
          ? this.getUrlSusan()
          : `assets/profile-pics-feed/${this.name}.png`;
    } else {
      this.imgSrc = 'assets/profile-pics/profile-empty.png';
    }
  }

  private getUrlSusan() {
    return 'assets/profile-pics/naam.png';
  }

  private getTime = () =>
    new Date(Date.now()).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
}

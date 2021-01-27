import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'diggel-post-reaction',
  templateUrl: './post-reaction.component.html',
  styleUrls: ['./post-reaction.component.scss'],
})
export class PostReactionComponent implements OnChanges {
  @Input() id: string;
  @Input() name: string;
  @Input() showname = true;
  @Input() showtime = true;
  imgSrc: string;
  minutes = 20;

  ngOnChanges(): void {
    if (this.name) {
      this.imgSrc =
        this.name === 'Susan'
          ? `assets/profile-pics/shutterstock_1257452734.png`
          : `assets/profile-pics-feed/${this.name}.png`;
    } else {
      this.imgSrc = 'assets/profile-pics/profile-empty.png';
    }
    if (this.id) {
      switch (this.id) {
        case 'A':
          this.minutes = Math.floor(Math.random() * 10) + 40;
          break;
        case 'B':
          this.minutes = Math.floor(Math.random() * 10) + 20;
          break;
        case 'C':
          this.minutes = Math.floor(Math.random() * 5) + 10;
          break;
        default:
          break;
      }
    }
  }
}

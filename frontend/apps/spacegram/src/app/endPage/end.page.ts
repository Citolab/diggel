import { Component, OnInit } from '@angular/core';
import { BaseEndPageComponent } from '@diggel/ui';

@Component({
  selector: 'diggel-endpage',
  templateUrl: './end.page.html',
  styleUrls: ['./end.page.scss'],
})
export class EndPageComponent extends BaseEndPageComponent implements OnInit {
  async ngOnInit() {
    this.textSessionReady = this.translate.instant('SPACEGRAM_END_THANKS');
    await super.ngOnInit();
  }
}

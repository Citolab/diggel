import { Component, OnInit } from '@angular/core';
import { BaseEndPageComponent } from '@diggel/ui';

@Component({
  selector: 'diggel-endpage',
  templateUrl: './end.page.html',
  styleUrls: ['./end.page.scss'],
})
export class EndPageComponent extends BaseEndPageComponent implements OnInit {
  async ngOnInit() {
    await super.ngOnInit();
    this.translate.setTranslation('en', {
      DIGGEL_END_THANKS: `Thanks! Now I use Spacebook myself.`
    }, true);
    this.translate.setTranslation('nl', {
      DIGGEL_END_THANKS: `Bedankt voor je hulp! Ik kan Spacebook nu zelf gebruiken.`
    }, true);
  }
}

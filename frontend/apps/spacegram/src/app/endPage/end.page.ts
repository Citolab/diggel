import { Component, OnInit } from '@angular/core';
import { BaseEndPageComponent } from '@diggel/ui';

@Component({
  selector: 'diggel-endpage',
  templateUrl: './end.page.html',
  styleUrls: ['./end.page.scss'],
})
export class EndPageComponent extends BaseEndPageComponent implements OnInit {
  async ngOnInit() {
    this.textSessionReady = `Bedankt voor je hulp! Ik kan Spacegram nu zelf gebruiken. `;
    await super.ngOnInit();
  }
}

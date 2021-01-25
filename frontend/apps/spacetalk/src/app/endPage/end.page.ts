import { Component, OnInit } from '@angular/core';
import { BaseEndPageComponent } from '@diggel/ui';

@Component({
  selector: 'diggel-endpage',
  templateUrl: './end.page.html',
  styleUrls: ['./end.page.scss'],
})
export class EndPageComponent extends BaseEndPageComponent implements OnInit {
  async ngOnInit() {
    this.textSessionReady = `<p>Bedankt!</p>
    <p>Het is gelukt om de spreekbeurt op tijd af te krijgen.</p>`;
    await super.ngOnInit();
  }
}

import { Component, OnInit } from '@angular/core';
import { BaseEndPageComponent } from '@diggel/ui';

@Component({
  selector: 'diggel-endpage',
  templateUrl: './end.page.html',
  styleUrls: ['./end.page.scss'],
})
export class EndPageComponent extends BaseEndPageComponent implements OnInit {
  async ngOnInit() {
    this.textSessionReady = `Ik ben heel blij met mijn nieuwe website. Bedankt!`;
    await super.ngOnInit();
  }
}

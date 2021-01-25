import { Component, OnInit } from '@angular/core';
import { AppBaseComponent } from '@diggel/ui';
import { itemDefinitions } from './items/items';
@Component({
  selector: 'diggel-root',
  templateUrl: './app.component.html',
})
export class AppComponent extends AppBaseComponent implements OnInit {
  ngOnInit(): void {
    this.items = itemDefinitions;
  }
}

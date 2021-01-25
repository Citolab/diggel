import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxEventHandlerModule } from 'ngx-event-handler';
import { UiModule } from '@diggel/ui';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    DragDropModule,
    NgbTooltipModule,
    NgxEventHandlerModule,
    UiModule,
  ],
  declarations: [],
  entryComponents: [],
  exports: [],
})
export class ItemModule { }

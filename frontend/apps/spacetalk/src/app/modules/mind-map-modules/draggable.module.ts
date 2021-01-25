import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectableDirective } from './connectable.directive';
import { ConnectionDirective } from './connection.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ConnectableDirective, ConnectionDirective],
  exports: [ConnectableDirective, ConnectionDirective],
})
export class DraggableModule {}

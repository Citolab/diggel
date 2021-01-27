import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'diggel-like-interaction',
  templateUrl: './like-interaction.component.html',
  styleUrls: ['./like-interaction.component.scss'],
})
export class LikeInteractionComponent {
  @Input() id: string;
  @Input() type = 'radio';
  @Input() group = 'options';
  @Input() readonly: boolean;
  @Input() small = false;
  @Input() response: string;
  @Output() selected = new EventEmitter<string>();
  @Output() deselected = new EventEmitter<string>();

  selectedOption = () => (!this.readonly ? this.selected.emit(this.id) : null);
  deselectedOption = () =>
    !this.readonly ? this.deselected.emit(this.id) : null;
}

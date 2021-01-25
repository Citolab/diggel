import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { ConnectableElement } from './connectable.element';
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appConnection]',
})
export class ConnectionDirective implements OnChanges {
  private _fromEl: ConnectableElement;
  private _toEl: ConnectableElement;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('from')
  set fromEl(el: ConnectableElement) {
    this._fromEl = el;
    this.position.x1 = el.x + el.width / 2;
    this.position.y1 = el.y + el.height / 2;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('to')
  set toEl(el: ConnectableElement) {
    this._toEl = el;
    this.position.x2 = el.x + el.width / 2;
    this.position.y2 = el.y + el.height / 2;
  }

  position: { x1; y1; x2; y2 } = { x1: 0, y1: 0, x2: 0, y2: 0 };

  constructor(public element: ElementRef) {
    (this.element.nativeElement as SVGLineElement).setAttribute('id', 'line2');
    (this.element.nativeElement as SVGLineElement).setAttribute(
      'stroke',
      'black'
    );
    this.updateLine();
  }
  ngOnChanges() {
    this.updateLine();
  }

  updateLine() {
    if (this._fromEl && this._toEl) {
      (this.element.nativeElement as SVGLineElement).setAttribute(
        'x1',
        this.position.x1
      );
      (this.element.nativeElement as SVGLineElement).setAttribute(
        'y1',
        this.position.y1
      );
      (this.element.nativeElement as SVGLineElement).setAttribute(
        'x2',
        this.position.x2
      );
      (this.element.nativeElement as SVGLineElement).setAttribute(
        'y2',
        this.position.y2
      );
    }
  }
}

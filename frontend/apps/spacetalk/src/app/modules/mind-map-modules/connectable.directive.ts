import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appConnectable]',
})
export class ConnectableDirective {
  @HostBinding('style.transform') get transform(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `translateX(${this.position.x}px) translateY(${this.position.y}px)`
    );
  }
  @Input() position = { x: 0, y: 0 };
  @Input() width: number;
  @Input() height: number;
  @Input() level: number;
  @Input() id: string;
  size = { w: 0, h: 0 };

  constructor(private sanitizer: DomSanitizer, element: ElementRef) {
    this.size.w = element.nativeElement.getBBox().width;
    this.size.h = element.nativeElement.getBBox().height;
  }
}

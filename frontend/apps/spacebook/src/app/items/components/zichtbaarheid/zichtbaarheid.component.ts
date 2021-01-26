import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'diggel-zichtbaarheid',
  templateUrl: './zichtbaarheid.component.html',
  styleUrls: ['./zichtbaarheid.component.css'],
})
export class ZichtbaarheidComponent implements OnInit {
  @Input() responseZichtbaarheid: string;
  @Input() readonly: boolean;
  @Output() zichtbaarheid = new EventEmitter<{ id: string; text: string }>();
  dropdownZichtbaarheidText = 'Zichtbaarheid';
  public selectedOption: { id: string; text: string };
  public privacyOptions = [
    { id: 'A', text: 'Iedereen' },
    { id: 'B', text: 'Vrienden van vrienden' },
    { id: 'C', text: 'Vrienden' },
  ];

  ngOnInit() {
    const selectedOption = this.privacyOptions.find(
      (p) => p.id === this.responseZichtbaarheid
    );
    this.dropdownZichtbaarheidText = selectedOption
      ? selectedOption.text
      : this.dropdownZichtbaarheidText;
  }

  selectedPrivacyOption(value: { id: string; text: string }) {
    if (value.id !== this.responseZichtbaarheid) {
      this.dropdownZichtbaarheidText = value.text;
      this.selectedOption = value;
      this.responseZichtbaarheid = value.id;
    } else {
      this.dropdownZichtbaarheidText = 'Zichtbaarheid';
      this.responseZichtbaarheid = '';
    }
    this.zichtbaarheid.emit(value);
  }
}

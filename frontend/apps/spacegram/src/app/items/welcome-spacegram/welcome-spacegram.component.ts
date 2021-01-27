import { Component } from '@angular/core';
import { ItemComponent } from '@diggel/ui';
import { itemWelcomeSpacegram as id } from '../items';
import { BehaviorSubject } from 'rxjs';
import { LogRow, ItemResult } from '@diggel/data';

@Component({
  selector: `diggel-welcome-spacegram`,
  templateUrl: './welcome-spacegram.component.html',
})
export class WelcomeSpacegramComponent implements ItemComponent {
  logStream = new BehaviorSubject<LogRow>(null);
  onNext = new BehaviorSubject<boolean>(null);

  readonly: boolean;
  id = id;
  loading: boolean;
  response = '';
  text: Map<string, string> = new Map([]);
  setLang(lang: string): void {
    if (lang === 'nl') {
      this.text['notification'] = `Bedankt! Het is gelukt om te registreren.
      Ik ben benieuwd wat ik kan vinden op Spacegram.`;
      this.text['welcome'] = 'Welkom bij';
      this.text['start'] = 'BEGIN';
    } else {
      this.text['notification'] = `Thanks! Now I'm registered. I'd love to see what my friends posted on Spacegram!`;
      this.text['welcome'] = 'Welcome to';
      this.text['start'] = 'START';
    }
  }

  getResult = (): ItemResult => null;
  setInitialValue(): void {
    // throw new Error('Method not implemented.');
  }

  getNotification = () =>  this.text['notification'];
}

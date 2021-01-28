import { Component } from '@angular/core';
import { ItemComponent } from '@diggel/ui';
import { itemWelcomeSpacebook as id } from '../items';
import { BehaviorSubject } from 'rxjs';
import { LogRow, ItemResult } from '@diggel/data';

@Component({
  selector: `diggel-welcome-spacebook`,
  templateUrl: './welcome-spacebook.component.html'
})
export class WelcomeSpacebookComponent implements ItemComponent {
  location?: string;

  logStream = new BehaviorSubject<LogRow>(null);
  onNext = new BehaviorSubject<boolean>(null);
  text: Map<string, string> = new Map([]);

  readonly: boolean;
  id = id;
  loading: boolean;
  response = '';

  set language(lang: string) {
    if (lang === 'nl') {
      this.text['notification'] = `Dank je! Het is gelukt om me te registreren.
      Ik ben benieuwd wat mijn vrienden op Spacebook zetten.`;
      this.text['welcome'] = 'Welkom bij';
      this.text['start'] = 'BEGIN';
    } else {
      this.text['notification'] = `Thanks! I'm registered.
      I'd love the see what my friends posted on Spacebook.`;
      this.text['welcome'] = 'Welcome to';
      this.text['start'] = 'START';
    }
  }

  getResult = (): ItemResult => null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setInitialValue(itemResult: ItemResult): void {
    // throw new Error('Method not implemented.');
  }
  getNotification = () => this.text['notification'];
}

import { BehaviorSubject } from 'rxjs';
import { LogRow, ItemResult } from '@diggel/data';

export interface ItemComponent {
  logStream: BehaviorSubject<LogRow>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: BehaviorSubject<any>;
  readonly: boolean;
  id: string;
  loading: boolean;
  location?: string;

  getNotification(): string;
  getResult(): ItemResult;
  setInitialValue(itemResult: ItemResult): void;
  setLang(lang: string): void;
}

import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { translations as nl } from './translations-nl';
import { translations as en } from './translations';

export class CustomLoader implements TranslateLoader {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTranslation(lang: string): Observable<any> {
        return of(lang === 'nl' ? nl : en);
    }
}
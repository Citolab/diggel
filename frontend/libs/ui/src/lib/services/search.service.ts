import { Injectable } from '@angular/core';
import { CordovaService } from './cordova.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Action, LogRow } from '@diggel/data';
import { GoogleSearchBrowser } from '../components/googlesearch/googlesearch.component';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public logStream = new BehaviorSubject<LogRow>(null);
  public shouldResume = false;
  private browser: GoogleSearchBrowser;
  constructor(
    private cordovaService: CordovaService,
    private http: HttpClient
  ) {
    if (this.cordovaService.onCordova) {
      this.browser = new GoogleSearchBrowser(this.http);
      this.logStream = this.browser.logStream;
    }
  }

  public stop() {
    this.shouldResume = false;
    if (this.cordovaService.onCordova && this.browser) {
      this.browser.stop();
    }
  }

  public search(url: string, resume = true) {
    if (this.cordovaService.onCordova) {
      this.browser.start(url, resume);
      this.shouldResume = true;
    } else {
      this.logStream?.next({
        action: Action.openLink,
        content: url,
        timestamp: new Date(),
      });
      window.open(url, '_blank');
    }
  }
}

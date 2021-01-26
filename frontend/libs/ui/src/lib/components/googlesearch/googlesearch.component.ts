/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { interval, Subscription, BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { LogRow, Action } from '@diggel/data';

function _window(): any {
  // return the global native browser window object
  return window;
}

export class GoogleSearchBrowser {
  public logStream = new BehaviorSubject<LogRow>(null);
  private syncBrowserIntervalSubscription: Subscription;
  private inBrowserRef: any; // InAppBrowser; // InAppBrowser // this should be the type: InAppBrowser but does not compile;
  private logdata: { [key: string]: LogRow } = {};

  constructor(private http: HttpClient) {}

  get cordova(): any {
    return _window().cordova;
  }

  public stop() {
    if (this.syncBrowserIntervalSubscription) {
      this.syncBrowserIntervalSubscription.unsubscribe();
    }
    if (this.inBrowserRef) {
      this.inBrowserRef.close();
    }
  }

  public start(initialUrl = 'https://www.google.nl/', resume = true) {
    this.logStream?.next({
      action: Action.openLink,
      content: initialUrl,
      timestamp: new Date(),
    });
    if (this.inBrowserRef && resume) {
      this.inBrowserRef.show();
    } else {
      this.http
        .get('./assets/injectedFile.js', { responseType: 'text' })
        .subscribe((scriptCode) => {
          let init = false;
          this.inBrowserRef = this.cordova.InAppBrowser.open(
            initialUrl,
            '_blank',
            `location=yes,clearsessioncache=yes,clearcache=yes,closebuttoncaption=Sluiten,` +
              `closebuttoncolor=#ffffff,toolbarcolor=#007bff,navigationbuttoncolor=#ffffff,hidden=no`
          );
          this.inBrowserRef.addEventListener('loadstop', (data) => {
            if (!init) {
              this.inBrowserRef.insertCSS({ code: '#lb{display: none!important;'});
              // clear localStorage to clear Google search history
              this.inBrowserRef.executeScript(
                {
                  code: `
                            (function() {
                                localStorage.clear();
                                return true;
                             })()`,
                },
                () => {
                  // cache is cleared. Now we can sync the localStorage to an array.
                  this.startSyncingLocalStorage();
                  this.inBrowserRef.executeScript({ code: scriptCode });
                  init = true;
                }
              );
            }
            if (data.url.indexOf('google.') !== -1) {
              // role^='listbox'    : hide suggestions
              // href~="accounts.   : hide login button
              // .fbar              : hide accept cookies
              this.inBrowserRef.insertCSS({
                code: `
                [role^='listbox'] { display: none!important; }
                [href*='account'] { display: none!important; }
                .fbar { display: none!important; }
              `,
              });
            }
          });
          this.inBrowserRef.addEventListener('loadstart', (data) => {
            const id = this.uuidv4();
            this.logdata[id] = {
              action: Action.navigation,
              content: data.url,
              timestamp: new Date(),
            };
            this.logStream.next(this.logdata[id]);
            if (init) {
              this.inBrowserRef.executeScript({ code: scriptCode });
            }
          });
        });
    }
  }

  startSyncingLocalStorage() {
    this.syncBrowserIntervalSubscription = interval(100)
      .pipe(takeWhile(() => !!this.inBrowserRef))
      .subscribe(() => {
        if (this.inBrowserRef) {
          this.inBrowserRef.executeScript(
            {
              code: `(function() {
                var data = [];
                var keys = [];
                for (var i = 0, len = localStorage.length; i < len; ++i) {
                    if (localStorage.key(i).startsWith('collected_data_')) {
                        data.push({ key: localStorage.key(i), value: localStorage.getItem(localStorage.key(i)) });
                        keys.push(localStorage.key(i));
                    }
                }
                // remove items that are synced.
                for (var i = 0, len = keys.length; i < len; ++i) {
                    localStorage.removeItem(keys[i]);
                }
                return data;
             })()`,
            },
            (values) => {
              if (values[0].length > 0) {
                values[0].forEach((v) => {
                  if (v.key) {
                    if (!this.logdata[v.key]) {
                      this.logdata[v.key] = JSON.parse(v.value);
                      this.logStream.next(this.logdata[v.key]);
                    }
                  }
                });
              }
            }
          );
        }
      });
  }

  private uuidv4 = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line one-var, no-bitwise
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}

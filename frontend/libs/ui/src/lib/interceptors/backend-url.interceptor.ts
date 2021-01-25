import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, NgZone, Injector } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { CordovaService } from '../services/cordova.service';
import { retryWhen, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { genericRetryStrategy } from '../components/error.modal.component';
import { environment } from 'environments/environment';
import { getbaseUrl } from '@diggel/data';
@Injectable()
export class BackendUrlInterceptor implements HttpInterceptor {
  private apiUrl = '';
  constructor(
    private injector: Injector,
    private router: Router,
    private zone: NgZone
  ) // eslint-disable-next-line
  //     //intercept
  {}

  intercept(
    req: HttpRequest<Request>,
    next: HttpHandler
  ): Observable<HttpEvent<Response>> {
    if (
      req.url &&
      req.url.indexOf('assets') === -1 &&
      req.url.indexOf('/player/') === -1
    ) {
      req = req.clone({
        withCredentials: true,
        url: this.getApiUrl() + req.url,
      });
      const cordovaService = this.injector.get(CordovaService);
      if (cordovaService.onCordova) {
        cordovaService.cordova.plugin.http.setDataSerializer('json');
        // on cordova httpOnly cookie is not send in the header to the backend.
        // the cordova http client does send the cookie.
        // the request on the Angular httpClient is intercepted and in case of an cordova app
        // use the cordova http Client and return an Observable of HttpResponse<any> like the Angular httpClient expects
        const options = {
          method: req.method,
          data: req.body,
          headers: {},
        };
        // NOTE THIS WILL BREAK ALL OTHER INTERCEPTORS BECAUSE ITS NOT PASSING THE REQUEST TO THE HTTPHANDLER
        // const cordovaRequestHandler = (from(new Promise((resolve, reject) =>
        const call = new Observable(
          (observer: Observer<HttpEvent<HttpResponse<Response>>>) => {
            cordovaService.cordova.plugin.http.sendRequest(
              req.url,
              options,
              (response) => {
                this.zone.run(() => {
                  observer.next(
                    new HttpResponse({
                      body: JSON.parse(response.data),
                      headers: req.headers,
                      status: response.status,
                      statusText: response.statusText,
                      url: req.url,
                    })
                  );
                  observer.complete();
                });
              },
              (error) => {
                this.zone.run(() => {
                  observer.error(
                    new HttpErrorResponse({
                      error: error ? error.error : '',
                      status: error ? error.status : 0,
                      url: req.url,
                    })
                  );
                });
              }
            );
          }
        );
        return this.retryAndAlertNoConnection(call);
      }
    }
    return this.retryAndAlertNoConnection(next.handle(req));
  }

  private retryAndAlertNoConnection(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpRequestHandle: Observable<HttpEvent<any>>
  ) {
    const ngbModal = this.injector.get(NgbModal);
    return httpRequestHandle
      .pipe(retryWhen(genericRetryStrategy({ ngbModal })))
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        tap(
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
          (err: unknown) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401 || err.status === 403) {
                this.router.navigate(['']);
              }
              if (!environment.production) {
                const toastrService = this.injector.get(ToastrService);
                if (err.error && err.error[0]) {
                  toastrService.error(
                    `${err.error[0].message} (errorcode ${err.error[0].errorCode})`
                  );
                } else {
                  toastrService.error(
                    err && err.message ? err.message : 'fout'
                  );
                }
              }
            }
          }
        )
      );
  }

  private getApiUrl() {
    if (!this.apiUrl) {
      if (
        environment.apibase.toLowerCase() === getbaseUrl().toLowerCase() ||
        environment.apibase.toLowerCase() === getbaseUrl().toLowerCase() + '/'
      ) {
        this.apiUrl = '/';
      }
      const cordovaService = this.injector.get(CordovaService);
      if (
        cordovaService.onCordova &&
        environment.apibase.toLowerCase().indexOf('localhost') !== -1
      ) {
        this.apiUrl = environment.apibase.replace('localhost', '10.0.2.2');
      } else {
        this.apiUrl = environment.apibase;
      }
    }
    return this.apiUrl;
  }
}

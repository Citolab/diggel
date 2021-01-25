import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { restartApp } from '@diggel/data';
import { CordovaService } from '../services/cordova.service';

@Injectable()
export class EnsureLoggedInGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private cordovaService: CordovaService
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.userService.isLoggedIn().pipe(
      map((value) => {
        if (!value) {
          restartApp(this.cordovaService.cordova);
        }
        return value;
      }),
      catchError(() => {
        restartApp(this.cordovaService.cordova);
        return of(false);
      })
    );
  }
}

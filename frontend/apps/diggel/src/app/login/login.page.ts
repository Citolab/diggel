import { Component } from '@angular/core';
import { UserService } from '@diggel/ui';
import { LoginResult } from '@diggel/data';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'diggel-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginComponent {
  public result: LoginResult;
  public accepted: boolean;
  public clicked = false;
  public code = '';

  constructor(private userService: UserService, private router: Router) {
    this.userService.useBackend = environment.useBackend;
  }

  checkMessage() {
    this.result = null;
  }

  async login(code: string, codeInput: { value: string }) {
    if (this.accepted) {
      this.clicked = true;
      this.code = code;
      this.userService.useBackend = environment.useBackend;
      const loginResult = await this.userService.login(code.toUpperCase());
      this.clicked = false;
      codeInput.value = '';

      if (loginResult.success) {
        this.router.navigateByUrl('/welcome');
      } else {
        this.result = loginResult;
      }
    }
  }
}

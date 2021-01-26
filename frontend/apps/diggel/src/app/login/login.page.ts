import { Component } from '@angular/core';
import { UserService } from '@diggel/ui';
import { LoginResult } from '@diggel/data';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private userService: UserService, private router: Router, translate: TranslateService) {
    this.userService.useBackend = environment.useBackend;
    translate.setTranslation('en', {
      DIGGEL_TERMS: `I do agreed that everything I do using these assignments is recorded and used for research purposes. `,
      DIGGEL_TITLE: 'Digital literacy',
      DIGGEL_LOGIN: 'Login',
      DIGGEL_GOOD_LUCK: 'Good luck with helping Susan!',
      DIGGEL_LOGIN_DESCRIPTION: `
        <p>Hi!</p>
        <p>
          You'll about to help Susan in two digital environments. She'll send
          you messages to ask for your help.
        </p>
        <p>
          You received a code to login. Fill in this code so you can help
          Susas.
        </p>`
    });
    translate.setTranslation('nl', {
      DIGGEL_TERMS: `Ik begrijp dat alles wat ik in deze opdrachten doe bijgehouden wordt.`,
      DIGGEL_TITLE: 'Digitale geletterdheid',
      DIGGEL_LOGIN: 'Inloggen',
      DIGGEL_GOOD_LUCK: 'Veel success met het helpen van Susan!',
      DIGGEL_LOGIN_DESCRIPTION: `
        <p>Welkom!</p>
        <p>
          Je gaat zo meteen Susan helpen in twee digitale omgevingen. Ze
          stuurt je steeds berichtjes waarin ze jou om hulp vraagt.
        </p>
        <p>
          Je hebt een leerlingcode gekregen. Vul die links in en klik op
          inloggen om Susan te helpen. Veel succes!
        </p>`
    });
    console.log(translate.instant('DIGGEL_TERMS'));
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

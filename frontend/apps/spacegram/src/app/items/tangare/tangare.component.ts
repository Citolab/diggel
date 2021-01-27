import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { itemTangare as id } from '../items';
import {
  defaultFeedback,
  prepareResponse,
  LogRow,
  Action,
  ItemResult,
} from '@diggel/data';
import { ItemComponent } from '@diggel/ui';

@Component({
  selector: `diggel-tangare`,
  templateUrl: './tangare.component.html'
})
export class TangareItemComponent implements ItemComponent {
  id = id;
  logStream = new BehaviorSubject<LogRow>(null);
  onNext = new BehaviorSubject<boolean>(null);
  readonly = true;
  loading = false;
  response = '';
  text: Map<string, string> = new Map([]);

  setLang(lang: string) {
    if (lang === 'nl') {
      this.text['post_intro'] = `<p>Hier een vogel uit Brazilië.
        Hij heeft 7 kleuren maar ik ben zijn naam vergeten.</p>
        <p>Weet iemand hoe deze vogel heet? 🤔</p>`;
      this.text['write_message'] = `Schrijf een reactie`;
      this.text['post'] = `Plaatsen`;
      this.text['notification'] = `Wat een grappig dier is Camil tegengekomen. Zoek op internet hoe dit dier heet. Zet de naam
      in een reactie op zijn bericht.<a href='https://www.google.com'>Zoek op internet</a>`;
    } else {
      this.text['post_intro'] = `<p>Look at this bird form Brazil.
        It has 7 colors but i don't know the name.</p>
        <p>Does anyone know the name of this bird? 🤔</p>`;
      this.text['write_message'] = `Write a comment`;
      this.text['post'] = `Post`;
      this.text['notification'] = `Camil found such a funny bird! Search on Internet for the name of this bird. 
      Enter the name of the bird in a comment.<a href='https://www.google.com'>Search on Internet</a>`;
    }
  }

  valueChanged(event: string) {
    this.logStream.next({
      action: Action.keyLog,
      content: event,
      timestamp: new Date(),
    });
    this.response = event;
  }

  logPaste(event: { clipboardData }) {
    this.logStream.next({
      action: Action.paste,
      content: event.clipboardData.getData('text/plain'),
      timestamp: new Date(),
    });
  }

  setInitialValue(itemResult: ItemResult): void {
    if (itemResult) {
      itemResult.responses.forEach((response) => {
        this.response = response.value;
      });
    } else {
      this.response = '';
    }
  }

  getResult(): ItemResult {
    const totalScore = this.score();
    const responses = [
      {
        interactionId: this.id,
        value: this.response,
        score: totalScore,
      },
    ];
    return {
      id: this.id,
      feedback: defaultFeedback(
        totalScore === responses.length,
        !!this.response
      ),
      totalScore,
      responses,
    };
  }

  getNotification = () => this.text['notification'];

  score() {
    const tangare = ['tangare'];

    // get correct answers and prepare with rules like lower case, trim etc.
    const correctAnswers = [
      ...[],
      ...tangare
    ].map((value) =>
      prepareResponse(value, {
        removeSpace: false,
      })
    );

    // prepare reponse with same rules before scoring
    const response = prepareResponse(this.response);
    return correctAnswers.find((c) => response.indexOf(c) !== -1) ? 1 : 0;
  }
}

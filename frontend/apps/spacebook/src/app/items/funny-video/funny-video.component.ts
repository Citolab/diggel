import { Component } from '@angular/core';
import { ItemComponent } from '@diggel/ui';
import { LogRow, ItemResult, Action } from '@diggel/data';
import { BehaviorSubject } from 'rxjs';
import { defaultFeedback } from '@diggel/data';
import { itemFunnyVideo as id } from '../items';

@Component({
  selector: `diggel-funny-video`,
  templateUrl: './funny-video.component.html',
  styleUrls: ['./funny-video.component.scss'],
})
export class FunnyVideoItemComponent implements ItemComponent {
  id = id;
  logStream = new BehaviorSubject<LogRow>(null);
  onNext = new BehaviorSubject<boolean>(null);
  readonly: boolean;
  loading: boolean;
  response = '';
  alternatives: { id: string, text: string }[] = []
  text: Map<string, string> = new Map([]);

  getNotification = () => this.text['notification'];

  setInitialValue(itemResult: ItemResult): void {
    if (itemResult) {
      itemResult.responses.forEach((response) => {
        this.response = response.value;
      });
    } else {
      this.response = '';
    }
  }

  setLang(lang: string) {
    this.alternatives = [
      {
        id: 'A', text: lang === 'nl' ?
          'Papegaai beledigt gasten in hotel' :
          'Parrot in hotel lobby insulting guests'
      },
      {
        id: 'B',
        text: lang === 'nl' ?
          'Kat rent achter een naakte baby in de sneeuw.' :
          'Cat chasing a naked baby through the snow'
      },
      {
        id: 'C',
        text: lang === 'nl' ?
        'Paard danst de Macarena' :
          'Horse dancing the Macarena'
      }
    ];
    if (lang === 'nl') {
      this.text['post_intro'] = `
        <p>Iemand van de lokale krant vroeg mij of ze één van mijn grappige foto's op hun website mochten zetten.</p>
        <p>Welke zou ik kunnen delen? De website is voor iedereen toegankelijk.</p>`;

      this.text['vote'] = `Stem in de poll.`;
      this.text['post'] = `Plaatsen`;
      this.text['notification'] = `Leuk dat Tom gevraagd is door de krant! Stem op het filmpje dat het meest geschikt is om te delen.`;
    } else {
      this.text['post_intro'] = `
        <p>I was asked to send in one of my videos for the funny video public page of the local newspaper.</p>
        <p>Which one should I share with them to publish on their website?</p>`;
      this.text['vote'] = `Vote here.`;
      this.text['write_message'] = `Write a comment`;
      this.text['post'] = `Post`;
      this.text['notification'] = `Yeah! Tom is asked by the local newspaper! Vote for the video that most suitable to be shared.`;
    }
  }

  getResult(): ItemResult {
    const totalScore = this.response === 'C' ? 1 : 0;
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

  selectedOption(answer: string) {
    if (this.readonly) {
      return;
    }
    if (this.response !== answer) {
      this.logStream.next({
        action: Action.selecteerAntwoord,
        content: answer,
        timestamp: new Date(),
      });
      this.response = answer;
    } else {
      this.logStream.next({
        action: Action.deselecteerAntwoord,
        content: answer,
        timestamp: new Date(),
      });
      this.response = '';
    }
  }
}

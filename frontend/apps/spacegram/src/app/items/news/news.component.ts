import { Component } from '@angular/core';
import { ItemComponent } from '@diggel/ui';
import { BehaviorSubject } from 'rxjs';
import { LogRow, ItemResult, Action } from '@diggel/data';
import { defaultFeedback } from '@diggel/data';
import { itemNews as id } from '../items';

@Component({
  selector: `diggel-news`,
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsItemComponent
  implements ItemComponent {
  id = id;
  location = 'suggestions';
  logStream = new BehaviorSubject<LogRow>(null);
  onNext = new BehaviorSubject<boolean>(null);
  readonly = true;
  loading = false;
  modalOpened = false;
  text: Map<string, string> = new Map([]);
  groups: { id: string, text: string, description: string, official: boolean, img: string, selected: boolean, isCorrect: boolean }[] = [];
  private lang: string;

  toggleGroup(id: string) {
    const matchingGroup = this.groups.find(g => g.id === id);
    this.logStream.next({
      action: matchingGroup
        ? Action.selectAnswer
        : Action.deselectAnswer,
      content: id,
      timestamp: new Date(),
    });
    this.groups = this.groups.map(g => {
      return g.id === id ?
        { ...g, selected: !g.selected } : g;
    });
  }

  set language(lang: string) {
    this.lang = lang;
    this.groups = [
      {
        id: 'breaking_news',
        text: (lang === 'nl' ? 'Laatste nieuws' : 'Latest news'),
        description: lang === 'nl' ? 'Het laatste nieuws' : 'Latest news',
        official: true,
        isCorrect: true,
      },
      {
        id: 'good_news',
        text: lang === 'nl' ? 'Het goede nieuws' : 'Good news',
        description: lang === 'nl' ? 'Alleen maar goed nieuws' : 'Only happy posts here',
        official: false,
        isCorrect: false,
      },
      {
        id: 'news',
        text: (lang === 'nl' ? 'Nieuws' : 'News'),
        description: lang === 'nl' ? 'Nieuws dat er toe doet' : 'News stories that matter',
        official: true,
        isCorrect: true,
      },
      {
        id: 'meme_news',
        text: lang === 'nl' ? 'Meme Nieuws' : 'Meme News',
        description: lang === 'nl' ? `Meme \\ Viral \\ Nieuws` : `Meme \\ Viral \\ News`,
        official: false,
        isCorrect: false,
      },
      {
        id: 'new_social',
        text: lang === 'nl' ? 'nieuwsocial' : 'newsocial',
        description: lang === '' ? 'Onze nieuwe social producten' : 'Our new social products ',
        official: true,
        isCorrect: false
      }
    ].map(g => {
      return {
        ...g,
        selected: false,
        img: `${g.id}.png`
      }
    });
    if (lang === 'nl') {
      this.text['SUGGESTED'] = `Aanbevolen pagina's`;
      this.text['REQUEST'] = `Verzoek indienen`;
      this.text['FOLLOWING'] = `Verzoek ingediend`;
      this.text['NEXT'] = `Volgende`;
      this.text['notification'] = `Ik wil betrouwbaar nieuws in mijn tijdslijn. Welke pagina's moet ik volgen?`;
    } else {
      this.text['SUGGESTED'] = 'Suggested pages for you';
      this.text['REQUEST'] = `Follow`;
      this.text['FOLLOWING'] = `Following`;
      this.text['NEXT'] = `Next`;
      this.text['notification'] = `I want reliable news sources in my feed. Which pages should I follow?`;
    }
  }

  setInitialValue(itemResult: ItemResult): void {
    if (itemResult) {
      if (itemResult.responses.length > 0) {
        const ids = itemResult.responses[0].value.split('&');
        this.groups = this.groups.map((group) => {
          group.selected = ids.some((id) => id === group.id);
          return group;
        });
      }
    }
  }

  trackById(_: number, { id }: { id: string }) {
    return id;
  }

  getResult(): ItemResult {
    const score = this.groups.find(g => g.selected !== g.isCorrect) ? 0 : 1;
    const response = this.groups
      .filter(g => g.selected)
      .map(g => g.id)
      .join('&');
    const responses = [
      {
        interactionId: this.id,
        value: response,
        score
      },
    ];
    return {
      id: this.id,
      feedback: defaultFeedback(score === 1,
        !!this.groups.find(g => g.selected), this.lang
      ),
      totalScore: score,
      responses,
    };
  }

  getNotification() {
    return this.text['notification'];
  }
}

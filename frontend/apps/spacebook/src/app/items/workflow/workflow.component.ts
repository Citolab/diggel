import { Component } from '@angular/core';
import { ItemComponent } from '@diggel/ui';
import { LogRow, ItemResult, Action, profileName } from '@diggel/data';
import { BehaviorSubject } from 'rxjs';
import { defaultFeedback } from '@diggel/data';
import { itemWorkflow as id } from '../items';

@Component({
  selector: `diggel-workflow`,
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowItemComponent implements ItemComponent {
  id = id;
  logStream = new BehaviorSubject<LogRow>(null);
  onNext = new BehaviorSubject<boolean>(null);
  readonly: boolean;
  loading: boolean;
  response = '';
  lang = '';
  text: Map<string, string> = new Map([]);
  alternatives: { id: string, text: string, person: profileName }[] = [];

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

  set language(lang: string) {
    this.lang = lang;
    if (lang === 'nl') {
      this.text['post_intro'] = `
        <p>Ik ben opzoek naar een online tool om met andere een workflow te maken</p>
        <p>Ik wil niet dat iedereen die mee wil doen een account moet aanmaken.</p>
        <p>Welke site kan ik het beste gebruiken?</p>`;
      this.text['notification'] = `Help Tom met het kiezen van een programma voor het maken van een workflow.`;
      this.text['POST'] = `Plaatsen`;
    } else {
      this.text['post_intro'] = `
        <p>I am looking for an online tool to make a workflow with other participants online.</p>
        <p>I want everyone to contribute without having to make an account.</p>
        <p> Which site should I use?</p>`;
      this.text['notification'] = `Help Tom finding the right tool to make a workflow.`;
      this.text['POST'] = `Post`;
      this.alternatives = [
        {
          id: 'A', person: 'Bahia', text: this.lang == 'nl' ?
            'Volgens mij kun je dat met WorkFlow doen.' :
            'I think you can use WorkFlow.'
        },
        {
          id: 'B', person: 'Camil', text: this.lang == 'nl' ?
            'Dat kan met FlowChart' :
            'You should use FlowChart'
        },
        {
          id: 'C', person: 'Anne', text: this.lang == 'nl' ?
            'Nee Workload Rage kun je daarvoor gebruiken.' :
            'No you should use Workload Rage.'
        },
        {
          id: 'D', person: 'Novan', text: this.lang == 'nl' ?
            'Je kunt hier het beste Chart Up voor gebruiken.' :
            'I would recommend Chart Up.'
        }
      ];
    }
  }

  getResult(): ItemResult {
    const totalScore = this.response.toLowerCase() === 'a' ? 1 : 0;
    const responses = [
      {
        interactionId: this.id,
        value: this.response,
        score: totalScore,
      },
    ];
    return {
      id: this.id,
      feedback: defaultFeedback(totalScore < 0, !!this.response, this.lang),
      totalScore,
      responses
    };
  }

  selectedOption(answer: string) {
    if (this.readonly) {
      return;
    }
    if (this.response !== answer) {
      this.logStream.next({
        action: Action.selectAnswer,
        content: answer,
        timestamp: new Date(),
      });
      this.response = answer;
    } else {
      this.logStream.next({
        action: Action.deselectAnswer,
        content: answer,
        timestamp: new Date(),
      });
      this.response = '';
    }
  }
}

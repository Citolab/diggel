import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  LogRow,
  AddLogRowNotification,
  AddItemResultNotification,
  getLocalSession,
  setLocalSession,
  ItemResult,
  convertQtiItemResult,
  START_RESPONSE,
  ITEM_SCORE,
  START_SCORE,
  TestSessionFinishResult,
} from '@diggel/data';
import { UserService } from './user.service';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    @Inject('contextId') private contextId: string
  ) { }

  public finish = () =>
    this.userService.useBackend
      ? this.http.post<TestSessionFinishResult>(`api/candidatesessions/finishTestSession`, {})
      : of({ code: 'success', message: 'Successfully stopped test session.' } as TestSessionFinishResult);


  public signout = () =>
    this.userService.useBackend
      ? this.http.post<TestSessionFinishResult>(`api/candidatesessions/signout`, {})
      : of({ code: 'success', message: 'Successfully stopped test session.' } as TestSessionFinishResult);

  public storeItemResult = (itemResult: ItemResult): Observable<void> => {
    // readableResponse = readableResponse || response;
    const outcomeVariables = itemResult.responses.map(r => {
      return {
        identifier: `${START_SCORE}${r.interactionId}`,
        value: r.score.toString()
      }
    });
    outcomeVariables.push({
      identifier: ITEM_SCORE,
      value: itemResult.totalScore.toString()
    });
    const command: AddItemResultNotification = {
      itemResult: {
        identifier: itemResult.id,
        itemContext: this.contextId,
        testSessionId: this.userService.testsessionId,
        outcomeVariables,
        responseVariables: itemResult.responses.map(r => {
          return {
            identifier: `${START_RESPONSE}${r.interactionId}`,
            candidateResponse: { value: r.readableValue || r.value === '[]' ? '' : r.value, interactionState: r.value || r.readableValue }
          }
        })
      }
    };
    this.storeInLocalStorage(command);
    return this.userService.useBackend
      ? this.http
        .post(`api/testsession/addResult`, command)
        .pipe(
          map(() =>
            console.log('addReponse to backend: ' + JSON.stringify(command))
          )
        )
      : of(
        console.log('addReponse to backend: ' + JSON.stringify(command))
      ).pipe(
        map(() => {
          return this.userService.itemAnswered.next(itemResult.id);
        })
      );
  };


  public addLog = (itemIdentifier: string, logRow: LogRow) => {
    if (logRow) {
      const command: AddLogRowNotification = {
        itemId: itemIdentifier,
        logAction: logRow.action,
        logText: logRow.content,
        timestamp: logRow.timestamp,
        testSessionId: this.userService.testsessionId,
      };
      if (this.userService.useBackend) {
        this.http.post(`api/testsession/addlogrow`, command).subscribe();
      } else {
        console.log('addLog to backend: ' + JSON.stringify(command));
      }
    }
  };

  private storeInLocalStorage(command: AddItemResultNotification) {
    let cachedSession = getLocalSession(this.userService.testsessionId);
    if (!cachedSession) {
      cachedSession = {
        id: this.userService.testsessionId,
        currentItemIndex: 0,
        startCode: '',
        groupName: '',
        itemResults: [],
        isDemoTestSession: true,
        testStatus: 'Started',
        context: this.contextId,
        testModuleId: Array.from(this.userService.context.keys()).map(k => {
          return { id: k, values: this.userService.context.get(k) }
        }).find(c => c.values.includes(this.contextId))?.id
      };
    }
    let currentItemResult = cachedSession.itemResults?.find(
      (i) => i.id === command.itemResult.identifier
    );
    if (!currentItemResult) {
      currentItemResult = {
        feedback: '',
        id: command.itemResult.identifier,
        responses: [],
        context: this.contextId,
        totalScore: 0
      };
      if (!cachedSession.itemResults) {
        cachedSession.itemResults = [];
      }
      cachedSession.itemResults.push(currentItemResult);
    }
    const itemResult = convertQtiItemResult(command.itemResult);
    currentItemResult.totalScore = itemResult.totalScore;
    currentItemResult.responses = itemResult.responses;
    setLocalSession(this.userService.testsessionId, cachedSession);
    this.userService.testSession = cachedSession;
  }
}

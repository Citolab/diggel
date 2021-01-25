import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TestSessionStartResult,
  StartTestSessionWithStartCodeCommand,
  LoginResult,
  TestSessionViewModel,
  ItemResult,
  getLocalSession,
  setLocalSession,
  getbaseUrl,
  TestSessionViewModelBackend,
  convertQtiItemResult,
} from '@diggel/data';
import { map, flatMap } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _testSession: TestSessionViewModel;
  public authenticated = false;
  public useBackend = true;
  public testsessionId = '';

  set testSession(session: TestSessionViewModel) {
    this._testSession = session;
    this.testsessionId = session?.id;
    if (session) {
      this.testSessionLoaded.next();
    }
  }
  get testSession() {
    return this._testSession;
  }
  public itemAnswered = new Subject<string>();
  public testSessionLoaded = new Subject();
  public applicationMapping: Map<
    string,
    { name: string; port: number }
  > = new Map([
    ['A', { name: 'spacebook', port: 4201 }],
    ['B', { name: 'spacegram', port: 4202 }],
    ['C', { name: 'webspace', port: 4203 }],
    ['D', { name: 'spacetalk', port: 4204 }],
  ]);
  public context: Map<number, string[]> = new Map([
    [1, ['A', 'C']],
    [2, ['A', 'D']],
    [3, ['B', 'C']],
    [4, ['B', 'D']],
    [5, ['C', 'A']],
    [6, ['C', 'B']],
    [7, ['D', 'A']],
    [8, ['D', 'B']],
  ]);

  private loginResult = {
    success: true,
    resumed: false,
    testSessionViewModel: {
      currentItemIndex: 0,
      groupName: 'demo groep',
      id: '12345',
      itemResults: [],
      testStatus: 'Started',
      testModuleId: 1,
    },
    message: 'login success',
  } as LoginResult;

  constructor(
    private http: HttpClient,
    @Inject('contextId') private contextId: string
  ) {
    this.useBackend = environment.useBackend;
    if (!this.useBackend) {
      this.testSession = getLocalSession(this.testsessionId);
      this.authenticated = true;
    }
  }
  // This function is call in the EnsureLogin Guard.
  // TestsessionId will have a value in the test.
  isLoggedIn(): Observable<boolean> {
    if (this.testsessionId) {
      this.authenticated = true;
      return of(true);
    }
    if (this.useBackend && !this.testsessionId) {
      return this.getSessionIdAndRestoreSession().pipe(
        map((response) => {
          if (this.testSession.isDemoTestSession) {
            this.testSession =
              getLocalSession(this.testsessionId) || this.testSession;
            this.useBackend = false;
          }
          return (
            response.succes &&
            this.testsessionId !== '00000000-0000-0000-0000-000000000000'
          );
        })
      );
    } else if (!this.useBackend) {
      this.testsessionId = 'LOCAL_SESSION';
      this.testSession = getLocalSession(this.testsessionId);
      this.authenticated = true;
      return of(true);
    }
  }

  // If a session is being resumed, the session will be retrieved from the backend.
  // The variable testsession will be set, which will be used by feedcomponent to set
  // the initial/restored value of the item.

  // Every response send to the backend is stored in localStorage to support
  // navigating backwards and refresh a 'localSession'.

  // For isDemoTestSession:
  // initial planned session is retrieved from the server.
  // after that, no backend is used.
  // refreshing will restore item results from localStorage
  // when logging in; previous item result will be clear from localStorage
  async login(loginCode: string): Promise<LoginResult> {
    localStorage.clear();
    if (!this.useBackend) {
      this.useBackend = false;
      return Promise.resolve(this.loginResult);
    }
    const command: StartTestSessionWithStartCodeCommand = {
      startCode: loginCode,
    };
    try {
      const loginResult = await this.http
        .post<TestSessionStartResult>(`api/candidatesessions/start`, command)
        .toPromise();
      if (loginResult.testSessionViewModel.isDemoTestSession) {
        // for demo sessions: delete all item-results
        // set use-backend to false
        this.testSession = { ...loginResult.testSessionViewModel, itemResults: [] };
        this.useBackend = false;
      } else {
        await this.getSessionIdAndRestoreSession(false).toPromise();
      }
      setLocalSession(this.testSession.id, this.testSession);
      const lastItem =
        loginResult.testSessionViewModel?.itemResults?.length > 0
          ? loginResult.testSessionViewModel.itemResults[
          loginResult.testSessionViewModel.itemResults.length - 1
          ]
          : null;
      return {
        success: true,
        resumed: false,
        lastItem,
        testSessionViewModel: loginResult.testSessionViewModel
      };
    } catch (error) {
      console.log('error: ', error);
      return Promise.resolve({
        success: false,
        resumed: false,
        lastItem: null,
        testSessionViewModel: null,
        message:
          (!error || +error.status) === 0
            ? 'Inloggen mislukt. Controleer internetverbinding.'
            : 'Onbekende startcode',
      });
    }
  }

  private getSessionIdAndRestoreSession(
    restoreItemPostion = true
  ): Observable<{ succes: boolean; lastItem?: string }> {
    return this.getSessionId().pipe(
      flatMap((testSessionId) => {
        if (testSessionId) {
          this.testsessionId = testSessionId;
          if (testSessionId) {
            return this.getTestSession(testSessionId).pipe(
              map((session) => {
                let lastItem: ItemResult = null;
                this.authenticated = true;
                this.testSession = session;
                this.testsessionId = session.id;
                if (!this.testSession.isDemoTestSession) {
                  setLocalSession(this.testSession.id, this.testSession);
                }
                if (
                  restoreItemPostion &&
                  this.testSession &&
                  this.testSession.itemResults &&
                  this.testSession.itemResults.length > 0
                ) {
                  // if retrieved testsession has results then navigate to the last item
                  lastItem = this.testSession.itemResults[
                    this.testSession.itemResults.length - 1
                  ];
                }
                return { succes: true, lastItem: lastItem?.id };
              })
            );
          } else {
            return of({ succes: true });
          }
        }
        return of({ succes: false });
      })
    );
  }

  public fullRefreshToNextApplication(isCorodova: boolean) {
    const moduleDetails = this.applicationMapping.get(this.testSession.context);
    if (isCorodova) {
      window.location.href = `file:///android_asset/www/${moduleDetails.name}/index.html`;
    } else if (!environment.production) {
      window.location.href = `http://localhost:${moduleDetails.port}`;
    } else {
      window.location.href = `${getbaseUrl()}/${moduleDetails.name}`;
    }
  }

  public toDemoTestApplication(isCorodova: boolean, applicationName: string) {
    let port = 4200;
    this.applicationMapping.forEach((element) => {
      if (element.name == applicationName) {
        port = element.port;
      }
    });
    if (isCorodova) {
      window.location.href = `file:///android_asset/www/${applicationName}/index.html`;
    } else if (!environment.production) {
      window.location.href = `http://localhost:${port}`;
    } else {
      window.location.href = `${getbaseUrl()}/${applicationName}`;
    }
  }

  public fullRefreshToSessionApplication(isCorodova: boolean) {
    const lastItem =
      this.testSession.itemResults?.length > 0
        ? this.testSession.itemResults[this.testSession.itemResults.length - 1]
        : null;

    const context = this.testSession.context.toUpperCase();
    const moduleDetails = this.applicationMapping.get(context);
    const lastItemQueryParam = lastItem?.id ? `#?lastItem=${lastItem.id}` : '';
    if (isCorodova) {
      window.location.href = `file:///android_asset/www/${moduleDetails.name}/index.html${lastItemQueryParam}`;
    } else if (!environment.production) {
      window.location.href = `http://localhost:${moduleDetails.port}${lastItemQueryParam}`;
    } else {
      window.location.href = `${getbaseUrl()}/${moduleDetails.name
        }${lastItemQueryParam}`;
    }
  }

  public getSessionId = () =>
    this.http.get<{ testSessionId: string }>(`api/testsession/getid`).pipe(
      map(({ testSessionId }) => {
        this.testsessionId = testSessionId;
        return testSessionId;
      })
    );

  public getTestSession = (testsessionId: string) =>
    this.useBackend
      ? testsessionId
        ? this.http.get<TestSessionViewModelBackend>(
          `api/testsession/${testsessionId}`
        ).pipe(map(session => this.ConvertTestSessionToFrontendModel(session)))
        : null
      : of(getLocalSession(testsessionId));

  private ConvertTestSessionToFrontendModel(testSessionBackend: TestSessionViewModelBackend) {
    const testSession: TestSessionViewModel = {
      ...testSessionBackend,
      itemResults: testSessionBackend.itemResults.map(i => convertQtiItemResult(i))
    };
    return testSession;
  }
}

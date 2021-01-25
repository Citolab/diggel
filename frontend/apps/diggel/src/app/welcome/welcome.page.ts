import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SearchService, UserService } from '@diggel/ui';
import { LoginResult } from '@diggel/data';
import { environment } from 'environments/environment';
import { CordovaService } from '@diggel/ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'diggel-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePageComponent implements AfterViewInit, OnInit {
  public demoUser = false;

  @ViewChild('modalContent', { static: true }) modalContent: ViewContainerRef;

  result: LoginResult;
  accepted: boolean;
  clicked = false;
  code = '';
  notificationMessage = `
    <p>Hoi, mijn naam is Susan. Kun je me helpen online te gaan?</p>
    <pIk wil graag dat je me helpt met een aantal programma’s. Ik stuur je steeds een berichtje als ik je hulp nodig heb.</p>
    <p>Voordat we beginnen wil ik je eerst vragen een vragenlijst over woorden in te vullen.</p>`;

  // applicationMapping: string[] = [];
  isDemoTestSession = false;
  applications: string[] = [];

  constructor(
    private userService: UserService,
    private cordovaService: CordovaService,
    private modalService: NgbModal
  ) {
     this.userService.useBackend = environment.useBackend;
    this.isDemoTestSession = !environment.useBackend || this.userService.testSession.isDemoTestSession;
  }

  ngOnInit(): void {
    if (this.isDemoTestSession) {
      this.applications = Array.from(
        this.userService.applicationMapping,
        ([, value]) => value.name
      );
    } else {
      this.applications = this.userService.context.get(this.userService.testSession.testModuleId).map(a => {
        return this.userService.applicationMapping.get(a).name;
      });
    }
  }

  checkMessage() {
    this.result = null;
  }

  clickDemoTestLink(application: string) {
    if (this.isDemoTestSession) {
      this.userService.toDemoTestApplication(
        this.cordovaService.cordova,
        application
      );
    }
  }

  async login() {
    this.userService.fullRefreshToSessionApplication(
      this.cordovaService.onCordova
    );
  }

  public getTime = () =>
    new Date(Date.now()).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
    });

  ngAfterViewInit() {
    setTimeout(() => {
      this.open(this.modalContent);
    }, 1200);
  }

  open(content) {
    this.modalService.open(content, {
      windowClass: 'modal-toaster pulldown no-pointer',
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: false,
    });
  }
}

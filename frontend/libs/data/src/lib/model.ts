import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';



export class LogRow {
  public timestamp: Date;
  public action: string;
  public content: string;
}
export class StartTestSessionWithStartCodeCommand {
  public startCode: string;
}

export interface ExtendedNgbModalOptions extends NgbModalOptions {
  logOpen?: boolean,
  logStream: BehaviorSubject<LogRow>,
  modalService: NgbModal,
  actionDescription: string;
}

export class TestSessionViewModelBackend {
  public id: string;
  public startCode: string;
  public testStatus: string;
  public groupName: string;
  public testModuleId: number;
  public context: string;
  public currentItemIndex: number;
  public itemResults: QtiItemResult[];
  public isDemoTestSession = false;
}

export class TestSessionViewModel {
  public id: string;
  public startCode: string;
  public testStatus: string;
  public groupName: string;
  public testModuleId: number;
  public context: string;
  public currentItemIndex: number;
  public itemResults: ItemResult[];
  public isDemoTestSession = false;
}

export class AddItemResultNotification {
  public itemResult: QtiItemResult;
}

export class InteractionResponse {
  public interactionId: string;
  public value: string;
  public readableValue?: string;
  public score: number;
}

export class AddLogRowNotification {
  public logAction: string;
  public logText: string;
  public testSessionId: string;
  public itemId: string;
  public timestamp: Date;
}

export class QtiItemResult {
  public testSessionId: string;
  public itemContext: string;
  public identifier: string;
  public outcomeVariables: {
    identifier: string;
    value: string;
  }[];
  public responseVariables: {
    identifier: string;
    candidateResponse: { value: string, interactionState: string }
  }[];
}

export class ItemResult {
  public id: string;
  public responses: InteractionResponse[];
  // public log: LogRow[];
  public context?: string;
  public totalScore: number;
  public feedback: string;
}
export class TestSessionStartResult {
  public code: string;
  public testSessionViewModel: TestSessionViewModel;
  public message: string;
}

export class TestSessionFinishResult {
  public code: string;
  public testSessionViewModel: TestSessionViewModel;
  public message: string;
}

export class LoginResult {
  public success: boolean;
  public resumed: boolean;
  public lastItem: ItemResult;
  public testSessionViewModel: TestSessionViewModel;
  public message?: string;
}

export class SessionState {
  sessionId: string;
  index: number;
  items: Item[];
}

export class Item {
  id: string;
  responses: { [interactionId: string]: string } = {};
}

export class Action {
  static zoekterm = 'zoekterm';
  static filter = 'filter';
  static navigatie = 'navigatie';
  static keyLog = 'tekst_invoer';
  static paste = 'plakken';
  static klik = 'klik';
  static klikAdvertentie = 'klik_advertentie';
  static sessionStarted = 'sessie_start';
  static sessionResumed = 'sessie_hervat';
  static sessionFinished = 'sessie_einde';
  static itemStarted = 'item_start';
  static selecteerAntwoord = 'selecteer_antwoord';
  static deselecteerAntwoord = 'deselecteer_antwoord';
  static geannuleerd = 'geannuleerd';
  static autocomplete = 'autocomplete';
  static bevestigd = 'bevestigd';
  static maakLink = 'maak_link';
  static verwijderLink = 'verwijder_link';
  static openLink = 'hyperlink_openen';
  static undoVerwijderLink = 'ongedaan_maken_verwijder_link';
  static undoAllVerwijderLink = 'ongedaan_alle_verwijderde_links';
  static slepen = 'gesleept_object_losgelaten';
  static kleur = 'kleur toegepast';
  static ongedaanMakenKleur = 'kleur ongedaan gemaakt';
  static selecteerTekst = 'selecteer_tekst';
  static deselecteerTekst = 'deselecteer_tekst';
}

export interface SelectableImage {
  url: string;
  description: string;
  isSelected: boolean;
  isCorrect?: boolean;
}

export const profileImages: Array<SelectableImage> = [
  {
    url: 'assets/profile-pics/adres.png',
    description: 'susanmetvriendin1',
    isSelected: false,
  },
  {
    url: 'assets/profile-pics/ID.png',
    description: `susan's id`,
    isSelected: false,
  },
  {
    url: 'assets/profile-pics/specs.png',
    description: 'susan met specificaties',
    isSelected: false,
  },
  {
    url: 'assets/profile-pics/naam.png',
    description: 'susan met naam',
    isSelected: false,
  },
  {
    url: 'assets/profile-pics/nummer.png',
    description: 'Susan met telefoonnummer',
    isSelected: false,
  },
];

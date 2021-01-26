import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

export type profileName = 'Bahia'|'Camil'|'Tom'|'Anne'|'Novan'|'Susan';

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
  static searchTerm = 'search_term';
  static filter = 'filter';
  static navigation = 'navigation';
  static keyLog = 'key_log';
  static paste = 'past';
  static click = 'click';
  static sessionStarted = 'sessie_start';
  static sessionResumed = 'sessie_resumed';
  static sessionFinished = 'sessie_finished';
  static itemStarted = 'item_start';
  static selectAnswer = 'select_answer';
  static deselectAnswer = 'deselect_answer';
  static cancelled = 'cancelled';
  static autocomplete = 'autocomplete';
  static confirmed = 'confirmed';
  static createLink = 'link_create';
  static deleteLink = 'link_delete';
  static openLink = 'open_hyperlink';
  static undoRemoveLink = 'link_remove_undo';
  static undoRemoveLinkAll = 'link_remove_undo_all';
  static drag = 'object_dragged';
  static color = 'collered';
  static colorUndo = 'color_undo';
  static selectText = 'text_select';
  static deselectText = 'text_deselect';
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

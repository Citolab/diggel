import { Action, ExtendedNgbModalOptions, ItemResult, QtiItemResult, TestSessionViewModel } from './model';
import { ITEM_SCORE, START_RESPONSE, START_SCORE } from './static-data';

export const getbaseUrl = (): string => {
  const pathArray = window.location.href.split('/');
  const protocol = pathArray[0];
  const host = pathArray[2];
  return protocol + '//' + host;
};

export const convertQtiItemResult = (qtiItemResult: QtiItemResult) => {
  return {
    id: qtiItemResult.identifier,
    totalScore: qtiItemResult?.outcomeVariables.find(o => o.identifier === ITEM_SCORE)?.value || 0,
    responses: qtiItemResult?.responseVariables.filter(r => r.identifier.startsWith(START_RESPONSE)).map(r => {
      const interactionId = r.identifier.replace(START_RESPONSE, '');
      const score = qtiItemResult?.outcomeVariables?.find(o => o.identifier === `${START_SCORE}${interactionId}`)?.value || 0;
      return {
        interactionId,
        score,
        value: r.candidateResponse.interactionState || r.candidateResponse.value,
        readableValue: r.candidateResponse.value || r.candidateResponse.interactionState
      }
    })
  } as ItemResult
}

// default = all options except remove spaces.
export const prepareResponse = (
  value: string,
  options: {
    removeDiacritcs?: boolean;
    removeSpace?: boolean;
    removeDoubleSpace?: boolean;
    lowerCase?: boolean;
    trim?: boolean;
    removePunctuations?: boolean;
  } = {}
) => {
  if (!value) return value;
  const mergedOptions = {
    removeDiacritcs:
      options.removeDiacritcs !== undefined ? options.removeDiacritcs : true,
    removeSpace:
      options.removeSpace !== undefined ? options.removeSpace : false,
    removeDoubleSpace:
      options.removeDoubleSpace !== undefined
        ? options.removeDoubleSpace
        : true,
    lowerCase: options.lowerCase !== undefined ? options.lowerCase : true,
    trim: options.trim !== undefined ? options.trim : true,
    removePunctuations:
      options.removePunctuations !== undefined
        ? options.removePunctuations
        : true,
  };
  if (mergedOptions.removeDiacritcs) {
    value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  if (mergedOptions.removePunctuations) {
    // eslint-disable-next-line no-useless-escape
    const punctuationless = value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    value = punctuationless.replace(/\s{2,}/g, ' ');
  }
  if (mergedOptions.removeSpace) {
    value = value.replace(/ /g, '');
  }
  if (mergedOptions.removeDoubleSpace) {
    value = value.replace(/\s\s+/g, ' ');
  }
  if (mergedOptions.lowerCase) {
    value = value.toLowerCase();
  }
  if (mergedOptions.trim) {
    value = value.trim();
  }

  return value;
};

export const restartApp = (cordova: boolean) => {
  if (cordova) {
    // android only;
    window.location.href = 'file:///android_asset/www/index.html';
  } else {
    const baseUrl = getbaseUrl();
    const url = new URL(baseUrl);
    if (url.port.includes('42')) {
      url.port = '4200';
    }
    window.location.href = url.toString();
  }
};

export const setLocalSession = (
  sessionId: string,
  testSession: TestSessionViewModel
) => {
  localStorage.setItem(sessionId, JSON.stringify(testSession));
};

export const getLocalSession = (sessionId: string): TestSessionViewModel => {
  const jsonSession = localStorage.getItem(sessionId);
  if (jsonSession) {
    try {
      return JSON.parse(jsonSession) as TestSessionViewModel;
    } catch (error) {
      return null;
    }
  }
  return null;
};
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export function getUnique<T>(arr: T[]): T[] {
  return arr.filter(onlyUnique);
}

export function groupBy<T, K>(list: T[], getKey: (item: T) => K) {
  const map = new Map<K, T[]>();
  list.forEach((item) => {
    const key = getKey(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return Array.from(map);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
export async function openModal(content: any, options: ExtendedNgbModalOptions, afterModalOpened = () => {}): Promise<'Cancel' | 'Next'> {
  if (options.logOpen == null || options.logOpen === true) {
    options.logStream.next({
      action: Action.click,
      content: `${options.actionDescription ? `${options.actionDescription} openen` : 'popup openen'}`,
      timestamp: new Date(),
    });
  }
  const dialog = options.modalService.open(content, options);
  afterModalOpened();
  const result = await dialog.result;
  if (result === 'Cancel') {
    options.logStream.next({
      action: Action.cancelled,
      content: `${options.actionDescription ? `${options.actionDescription} geannuleerd` : 'popup openen geannuleerd'}`,
      timestamp: new Date(),
    });
  }
  if (result === 'Next') {
    options.logStream.next({
      action: Action.confirmed,
      content: `${options.actionDescription ? `${options.actionDescription} bevestigd` : 'popup openen bevestigd'}`,
      timestamp: new Date(),
    });
  }
  return result;
}

export function sort<T, K>(list: T[], getKey: (item: T) => K, desc = false) {
  list.sort((a: T, b: T) => {
    const valueA = getKey(a);
    const valueB = getKey(b);
    if (valueA < valueB) {
      return !desc ? -1 : 1;
    } else if (valueA > valueB) {
      return !desc ? 1 : -1;
    } else {
      return 0;
    }
  });
  return list;
}

export const trim = (value: string, char: string) => {
    if (char === ']') char = '\\]';
    if (char === '\\') char = '\\\\';
    return value.replace(new RegExp(
      "^[" + char + "]+|[" + char + "]+$", "g"
    ), "");
}

export const defaultFeedback = (
  isCorrect: boolean,
  answered: boolean
): string => {
  const possibleAnswers = ['Fijn 🙂', 'Dank je! 😁', 'Mooi 👍', 'Super 👌'];
  return !answered
    ? null
    : `<span>${possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)]
    }</span>`;
};

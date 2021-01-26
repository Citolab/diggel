import { Observable, from, empty } from 'rxjs';
import { timer, throwError } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';
import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'diggel-error-modal-content',
  template: `<div class="modal-header">
      <h4
        class="modal-title mdi mdi-wifi-strength-alert-outline"
        id="modal-basic-title"
      >
        &nbsp;{{ noConnection }}
      </h4>
    </div>
    <div class="modal-body">{{ noConnectionMessage }}</div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-success rounded-0"
        (click)="activeModal.close('RETRY')"
      >
      {{ retry }}
        <span class="mdi mdi-refresh"></span>
      </button>
    </div>`,
})
export class ErrorModalContentComponent {
  retry = this.translate.instant('DIGGEL_NO_CONNECTION_RETRY');
  noConnectionMessage = this.translate.instant('DIGGEL_NO_CONNECTION_MESSAGE');
  noConnection = this.translate.instant('DIGGEL_NO_CONNECTION');
  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {
    translate.setTranslation('en', {
      DIGGEL_NO_CONNECTION: 'No internet connection',
      DIGGEL_NO_CONNECTION_MESSAGE: 'Ask for help or try again',
      DIGGEL_NO_CONNECTION_RETRY: 'Retry',
    });
    translate.setTranslation('nl', {
      DIGGEL_NO_CONNECTION: 'Geen verbinding',
      DIGGEL_NO_CONNECTION_MESSAGE: 'Vraag iemand om hulp en probeer het opnieuw.',
      DIGGEL_NO_CONNECTION_RETRY: 'Probeer opnieuw',
    });

  }
}

export const genericRetryStrategy = ({
  ngbModal = null,
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = [401, 403, 400],
}: {
  ngbModal?: NgbModal;
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
} = {}) => (attempts: Observable<{ status: number }>) =>
    attempts.pipe(
      mergeMap((error: { status: number }, i) => {
        const retryAttempt = i + 1;
        // if maximum number of retries have been met
        // or response is a status code we don't wish to retry, throw error
        if (excludedStatusCodes.find((e) => e === error.status)) {
          return throwError(error);
        }
        if (retryAttempt > maxRetryAttempts) {
          // not a known api error, so show a modal
          if (!ngbModal.hasOpenModals()) {
            return from(
              ngbModal.open(ErrorModalContentComponent, {
                windowClass: 'dark-modal modal-animate',
                ariaLabelledBy: 'modal-basic-title',
                beforeDismiss: () => false,
              }).result
            );
          } else {
            return empty();
          }
        } else {
          // retry after 1s, 2s, etc...
          console.log(
            `Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration
            }ms`
          );
          return timer(retryAttempt * scalingDuration);
        }
      }),
      finalize(() => console.log('We are done!'))
    );

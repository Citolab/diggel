import { Component } from '@angular/core';
import { ItemComponent } from '@diggel/ui';
import {
  NgbModal,
  NgbCarouselConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { LogRow, ItemResult, Action, openModal } from '@diggel/data';
import { defaultFeedback } from '@diggel/data';
import { itemTie as id } from '../items';

@Component({
  selector: `diggel-tie`,
  templateUrl: './tie.component.html',
  styleUrls: ['./tie.component.scss'],
})
export class TieItemComponent implements ItemComponent {
  id = id;
  logStream = new BehaviorSubject<LogRow>(null);
  onNext = new BehaviorSubject<boolean>(null);
  readonly = true;
  modalOpened = false;
  loading = false;
  text: Map<string, string> = new Map([]);
  images = ['knoop maken', 'knopen', 'knoop', 'knopen maken'].map((imgSrc) => ({
    id: imgSrc,
    url: `./assets/items/tie/${imgSrc}.png`,
    order: null,
  }));
  correct = ['knopen maken', 'knopen', 'knoop', 'knoop maken']

  private answered = false;
  private imageOrdering = false;

  constructor(private modalService: NgbModal, config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 2000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  setInitialValue(itemResult: ItemResult): void {
    if (itemResult && itemResult.responses) {
      const storedOrder = itemResult.responses.find(
        (r) => r.interactionId === this.id
      );
      if (storedOrder) {
        const order = storedOrder.value.split('');
        order.forEach((imgId, index) => {
          const selectedImage = this.images.find((i) => i.id === imgId);
          if (selectedImage) {
            selectedImage.order = index + 1;
          }
        });
      }
    }
  }

  setLang(lang: string) {
    if (lang === 'nl') {
      this.text['MODAL_ACTION'] = `openen foto's`;
      this.text['CHOOSE_PICTURE'] = 'Kies fotos';
      this.text['PHOTO_STORY'] = 'Fotoverhaal';
      this.text['CANCEL'] = `Annuleren`;
      this.text['OK'] = `Klaar`;
      this.text['POST'] = `Plaatsen`;
      this.text['NOTIFICATION'] = `<p>Ik wil graag een foto-verhaal delen over hoe je een knoop maakt. ` +
      `In de fotorol staan <b>vier</b> foto's.</p><p>Selecteer deze foto's in de juiste volgorde.</p>`;
    } else {
      this.text['MODAL_ACTION'] = `open image galary`;
      this.text['CHOOSE_PICTURE'] = 'Select images';
      this.text['PHOTO_STORY'] = 'Photo story';
      this.text['CANCEL'] = `Cancel`;
      this.text['OK'] = `Ok`;
      this.text['POST'] = `Post`;
      this.text['NOTIFICATION'] = `<p>I want to use a slideshow to show how to tie a knot.</p>
      <p>Select the photo's in the order of making.</p>.`;

    }
  }

  getResult(): ItemResult {
    const response = this.images
      .filter((i) => i.order > 0)
      .sort((a, b) => a.order - b.order)
      .map((i) => i.id)
      .join('');
    const score = response === this.correct.join('') ? 1 : 0;
    this.answered = !!this.images.find(i =>!i.order);
    const responses = [
      {
        interactionId: this.id,
        value: response,
        score
      },
    ];
    return {
      id: this.id,
      feedback: defaultFeedback(score === responses.length, this.answered),
      totalScore: score,
      responses
    };
  }

  setImageOrder(image: { id: string, order?: number}) {
    if (!this.imageOrdering) {
      this.imageOrdering = true;
      if (image.order == null) {
        if (this.images.filter((i) => i.order > 0).length >= 4) {
          this.logStream.next({
            action: Action.selectAnswer,
            content: 'Order - tries to select 5th image',
            timestamp: new Date(),
          });
          this.imageOrdering = false;
          return; // don't do anything if user already selected 5 images.
        }
        image.order = this.images.filter((i) => !!i.order).length + 1;
        this.logStream.next({
          action: Action.selectAnswer,
          content: `Order - image: ${image.id}, order: ${image.order}`,
          timestamp: new Date(),
        });
        this.imageOrdering = false;
        return;
      } else {
        this.images = this.images.map((img) => {
          if (img.order > image.order) {
            img.order--;
          }
          return img;
        });
        this.logStream.next({
          action: Action.deselectAnswer,
          content: `Order - image: ${image.id}, order: ${image.order}`,
          timestamp: new Date(),
        });
        image.order = null;
      }
      this.imageOrdering = false;
    }
  }

  get sortedImages(): Array<{ id: string, order?: number, url: string}> {
    const imagesChosen = this.images.filter((img) => img.order > 0);
    const imagesSorted = imagesChosen.sort((a, b) => a.order - b.order);
    return imagesSorted;
  }

  getNotification = () => this.text['NOTIFICATION'];
  async open(content) {
    this.modalOpened = true;
    try {
      await openModal(content, {
        actionDescription: this.text['MODAL_ACTION'],
        logStream: this.logStream,
        modalService: this.modalService,
        size: 'lg',
        windowClass: 'cameraroll',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      });
      this.modalOpened = false;
    } catch {
      this.modalOpened = false;
    }
  }
}

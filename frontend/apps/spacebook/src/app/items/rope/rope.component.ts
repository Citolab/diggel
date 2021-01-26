import { Component } from '@angular/core';
import { ItemComponent } from '@diggel/ui';
import {
  NgbModal,
  NgbCarouselConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { LogRow, ItemResult, Action, openModal } from '@diggel/data';
import { defaultFeedback } from '@diggel/data';
import { itemKoekjesBakken as id } from '../items';

interface ImageOrderInterface {
  id: number;
  url: string;
  order?: number;
}

@Component({
  selector: `diggel-koekjes-bakken`,
  templateUrl: './koekjes-bakken.component.html',
  styleUrls: ['./koekjes-bakken.component.scss'],
})
export class KoekjesComponent implements ItemComponent {
  id = id;
  logStream = new BehaviorSubject<LogRow>(null);
  onNext = new BehaviorSubject<boolean>(null);
  readonly = true;
  modalOpened = false;
  responseVolgorde = '';
  loading = false;
  dropdownZichtbaarheidText = 'Zichtbaarheid';

  private answered = false;
  private imageOrdering = false;

  public images: ImageOrderInterface[] = [1, 2, 3, 4].map((sequence) => ({
    id: sequence,
    url: `./assets/items/koekjes-bakken/${sequence}.png`,
    order: null,
  }));

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
      const volgorde = itemResult.responses.find(
        (r) => r.interactionId === this.id
      );
      if (volgorde) {
        const order = volgorde.value.split('');
        order.forEach((orderNumber, index) => {
          const selectedImage = this.images.find((i) => i.id === +orderNumber);
          if (selectedImage) {
            selectedImage.order = index + 1;
          }
        });
      }
    }
  }

  getResult(): ItemResult {
    this.responseVolgorde = this.images
      .filter((i) => i.order > 0)
      .sort((a, b) => a.order - b.order)
      .map((i) => i.id)
      .join('');
    const scoreVolgorde = this.responseVolgorde === '3421' ? 1 : 0;
    this.answered = this.responseVolgorde.length === 4;
    const totalScore = scoreVolgorde;
    const responses = [
      {
        interactionId: this.id,
        value: this.responseVolgorde,
        score: scoreVolgorde,
      },
    ];
    return {
      id: this.id,
      feedback: defaultFeedback(totalScore === responses.length, this.answered),
      totalScore,
      responses
    };
  }

  setImageOrder(image: ImageOrderInterface) {
    if (!this.imageOrdering) {
      this.imageOrdering = true;
      if (image.order == null) {
        if (this.images.filter((i) => i.order > 0).length >= 4) {
          this.logStream.next({
            action: Action.selecteerAntwoord,
            content: 'volgorde - probeert 5e plaatje te kiezen',
            timestamp: new Date(),
          });
          this.imageOrdering = false;
          return; // don't do anything if user already selected 5 images.
        }
        image.order = this.images.filter((i) => !!i.order).length + 1;
        this.logStream.next({
          action: Action.selecteerAntwoord,
          content: `volgorde - plaatje: ${image.id}, volgorde: ${image.order}`,
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
          action: Action.deselecteerAntwoord,
          content: `volgorde - plaatje: ${image.id}, volgorde: ${image.order}`,
          timestamp: new Date(),
        });
        image.order = null;
      }
      this.imageOrdering = false;
    }
  }

  get sortedImages(): Array<ImageOrderInterface> {
    const imagesChosen = this.images.filter((img) => img.order > 0);
    const imagesSorted = imagesChosen.sort((a, b) => a.order - b.order);
    return imagesSorted;
  }

  getNotification = () =>
    `<p>Ik heb gisteren koekjes gebakken. Ik wil daar een foto-verhaal over delen. ` +
    `In de fotorol staan <b>vier</b> foto's van het koekjes bakken.</p><p>Selecteer deze foto's in de juiste volgorde.</p>`;

  async open(content) {
    this.modalOpened = true;
    try {
      await openModal(content, {
        actionDescription: `openen foto's`,
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

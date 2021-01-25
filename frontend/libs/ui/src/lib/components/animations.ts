import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const slideIn = trigger('slideIn', [
  state(
    '*',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translateY(-10%)',
    }),
    animate('0.6s ease-in'),
  ]),
]);

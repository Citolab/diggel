import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe<T> implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(items: T[], filter: { field: string; value: any }): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => item[filter.field] === filter.value);
  }
}

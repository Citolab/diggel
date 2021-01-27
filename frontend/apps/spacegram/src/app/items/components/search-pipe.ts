import { Pipe, PipeTransform } from '@angular/core';

// A simple searchpipe only used in this component, disposable if this item is not used anymore.
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(items: any[], field: string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (!value || value.trim().length === 0) {
      return items;
    }

    const searchTerms = value.split(' ');
    const filteredItemsArray = items.map((item) => {
      let searchPoints = 0;
      const itemterms = item[field].toString().split(' ');
      itemterms.forEach((itemterm) => {
        searchTerms.forEach((searchTerm) => {
          if (itemterm.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            searchPoints++;
          }
        });
      });
      return { group: item, searchPoints };
    });

    filteredItemsArray.sort((a, b) => b.searchPoints - a.searchPoints);
    return filteredItemsArray
      .filter((fi) => fi.searchPoints > 0)
      .map((fi) => fi.group);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

import { HistoryEventEnum, HistoryEntry } from '../../core/graphql/graphql';

@Pipe({
  name: 'historyEntryIcon',
})
export class HistoryEntryIconPipe implements PipeTransform {
  transform(value: HistoryEntry): string {
    switch (value.event) {
      case HistoryEventEnum.LabelsChanged:
        return 'tags';
      case HistoryEventEnum.AssigneesChanged:
        return 'team';
      case HistoryEventEnum.StatusChanged:
        return 'info-circle';
      case HistoryEventEnum.DescriptionUpdated:
        return 'edit';
      default:
        return 'question-circle';
    }
  }
}

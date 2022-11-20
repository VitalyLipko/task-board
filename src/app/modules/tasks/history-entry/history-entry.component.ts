import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HistoryEventEnum, HistoryEntry } from '../../../core/graphql/graphql';

@Component({
  selector: 'tb-history-entry',
  templateUrl: './history-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryEntryComponent {
  @Input() tbHistoryEntry!: HistoryEntry;

  get eventKey(): string {
    switch (this.tbHistoryEntry.event) {
      case HistoryEventEnum.LabelsChanged:
        return 'task.changed_labels';
      case HistoryEventEnum.AssigneesChanged:
        return 'task.changed_assignees';
      case HistoryEventEnum.StatusChanged:
        return 'task.changed_status';
      case HistoryEventEnum.DescriptionUpdated:
        return 'task.updated_description';
      default:
        return '';
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HistoryEntry } from '../../../core/graphql/graphql';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'tb-history',
  templateUrl: './history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit, OnDestroy {
  historyEntries: Array<HistoryEntry> | undefined;
  private unsubscribe = new Subject<void>();

  @Input() tbParentId!: string;

  constructor(
    private tasksService: TasksService,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.tasksService
      .getHistoryEntries(this.tbParentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (history) => {
          this.historyEntries = history;
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
    this.tasksService
      .historyEntryAdded(this.tbParentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (historyEntry) => {
          if (this.historyEntries) {
            this.historyEntries = [...this.historyEntries, historyEntry];
            this.cdr.markForCheck();
          }
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  trackByFn(_: number, item: HistoryEntry): string {
    return item.id;
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, of, startWith, Subject, switchMap } from 'rxjs';
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
  private historyToDisplay = new BehaviorSubject<
    Array<HistoryEntry> | undefined
  >(undefined);
  historyToDisplay$ = this.historyToDisplay.asObservable();

  @Input() tbParentId!: string;

  constructor(
    private tasksService: TasksService,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.tasksService
      .historyEntryAdded(this.tbParentId)
      .pipe(
        startWith(null),
        switchMap((entry) => {
          const historyToDisplay = this.historyToDisplay.value;
          if (entry && historyToDisplay) {
            return of([...historyToDisplay, entry]);
          }
          return this.tasksService.getHistoryEntries(this.tbParentId);
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe({
        next: (historyEntry) => this.historyToDisplay.next(historyEntry),
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

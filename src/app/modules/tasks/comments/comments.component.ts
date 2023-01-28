import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, startWith, Subject, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

import { Comment } from '../../../core/graphql/graphql';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'tb-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit {
  readonly commentsCounterStyle = { backgroundColor: '#52c41a' };
  inputComment: string | null = null;
  commentsOpened = true;

  private unsubscribe = new Subject<void>();
  private commentsToDisplay = new BehaviorSubject<Array<Comment> | undefined>(
    undefined,
  );
  readonly commentsToDisplay$ = this.commentsToDisplay.asObservable();

  @Input() tbParentId!: string;

  constructor(
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.tasksService
      .commentCreated(this.tbParentId)
      .pipe(
        startWith(null),
        switchMap((comment) => {
          const commentsToDisplay = this.commentsToDisplay.value;
          if (comment && commentsToDisplay) {
            return of([...commentsToDisplay, comment]);
          }
          return this.tasksService.getComments(this.tbParentId);
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe({
        next: (res) => this.commentsToDisplay.next(res),
        error: (err) => this.messageService.error(err.message),
      });
  }

  handleSubmit(): void {
    this.tasksService
      .createComment({
        parentId: this.tbParentId,
        message: this.inputComment as string,
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.inputComment = null;
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  trackByFn(_: number, item: Comment): string {
    return item.id;
  }
}

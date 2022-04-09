import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  comments: Array<Comment> | undefined;
  inputComment: string | null = null;
  commentsOpened = true;

  private unsubscribe = new Subject<void>();

  @Input() tbParentId!: string;

  constructor(
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.tasksService
      .getComments(this.tbParentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (comments) => {
          this.comments = comments;
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
    this.tasksService
      .commentCreated(this.tbParentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (comment) => {
          if (this.comments && comment) {
            this.comments = [...this.comments, comment];
            this.cdr.markForCheck();
          }
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  handleSubmit(): void {
    this.tasksService
      .createComment({
        parentId: this.tbParentId,
        message: this.inputComment as string,
      })
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

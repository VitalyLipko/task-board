import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Comment } from '../../../core/graphql/graphql';
import { fullNameToInitials } from '../../../shared/utils/fullname-to-initials';
import { stringToColor } from '../../../shared/utils/string-to-color';

@Component({
  selector: 'tb-comment',
  templateUrl: './comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input() tbComment!: Comment;

  get backgroundColor(): string {
    return stringToColor(this.tbComment.creator.profile.fullName);
  }

  get initials(): string {
    return fullNameToInitials(this.tbComment.creator.profile.fullName);
  }

  get created(): string {
    return this.datePipe.transform(this.tbComment.created, 'short') as string;
  }

  constructor(private datePipe: DatePipe) {}
}

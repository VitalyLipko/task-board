import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { extractLabel } from '../../../../shared-utils/extract-label';
import { Label } from '../../core/graphql/graphql';

@Component({
  selector: 'tb-label',
  template: `
    <nz-tag [nzColor]="backgroundColor" [class.tb-label-with-scope]="scope">
      <ng-container *ngIf="scope; else titleTemplate">
        <span class="tb-label-scope" nz-typography nzEllipsis>
          {{ scope }}
        </span>
        <ng-container *ngTemplateOutlet="titleTemplate"></ng-container>
      </ng-container>
      <ng-template #titleTemplate>
        <span class="tb-label-title" nz-typography nzEllipsis>{{ title }}</span>
      </ng-template>
    </nz-tag>
  `,
  styles: [
    `
      @use 'variables';

      nz-tag {
        max-width: 200px;
        display: inline-flex;
        margin-bottom: variables.$indent-xs;

        &.tb-label-with-scope {
          padding: 2px 7px 2px 2px;

          .tb-label-title {
            color: white;
          }
        }

        &:not(.tb-label-with-scope) {
          padding-top: 2px;
          padding-bottom: 2px;
        }

        span {
          max-width: 100px;
        }
      }

      .tb-label-scope {
        padding: 0 variables.$indent-xxs;
        margin-right: variables.$indent-xxs;
        background-color: #fafafa;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  scope: string | undefined;
  title!: string;
  backgroundColor!: string;

  @Input() set tbLabel(value: Label) {
    const { scope, title } = extractLabel(value.title);
    this.scope = scope;
    this.title = title;
    this.backgroundColor = value.backgroundColor;
  }
}

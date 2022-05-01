import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  Injector,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { UploadAbstractClass } from '../../../shared/abstract-classes/upload.abstract-class';

@Component({
  selector: 'tb-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrls: ['./project-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectIconComponent),
      multi: true,
    },
  ],
})
export class ProjectIconComponent extends UploadAbstractClass {
  constructor(injector: Injector) {
    super(injector);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Injector,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { UploadAbstractClass } from '../../../shared/abstract-classes/upload.abstract-class';

@Component({
  selector: 'tb-profile-avatar',
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProfileAvatarComponent),
      multi: true,
    },
  ],
})
export class ProfileAvatarComponent extends UploadAbstractClass {
  @Input() tbFullName!: string;

  constructor(protected injector: Injector) {
    super(injector);
  }

  handleOverlayClick(event: MouseEvent): void {
    if (this.imageUrl) {
      this.handleDelete(event);
    }
  }
}

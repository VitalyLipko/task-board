import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormAbstractClass } from '../../../shared/abstract-classes/form.abstract-class';
import { confirmPasswordValidation } from '../../../shared/utils/confirm-password-validation';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'tb-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordModalComponent
  extends FormAbstractClass
  implements OnDestroy
{
  private unsubscribe = new Subject<void>();
  constructor(
    public modalRef: NzModalRef,
    private profileService: ProfileService,
    private messageService: NzMessageService,
  ) {
    super();
    this.form = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
    });
    this.form.addValidators(confirmPasswordValidation);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    this.profileService
      .changePassword(this.form.value.currentPassword, this.form.value.password)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => this.modalRef.close(),
        error: (err) => this.messageService.error(err.message),
      });
  }
}

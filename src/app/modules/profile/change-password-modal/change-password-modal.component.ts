import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormAbstractClass } from '../../../shared/abstract-classes/form.abstract-class';
import { confirmPasswordValidation } from '../../../shared/utils/confirm-password-validation';
import { ProfileService } from '../profile.service';

import { ChangePasswordModalFormType } from './change-password-modal-form.type';

@Component({
  selector: 'tb-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordModalComponent
  extends FormAbstractClass<ChangePasswordModalFormType>
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
      currentPassword: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
    this.form.addValidators(confirmPasswordValidation);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    const { currentPassword, password } = this.form.getRawValue();
    this.profileService
      .changePassword(currentPassword, password)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => this.modalRef.close(),
        error: (err) => this.messageService.error(err.message),
      });
  }
}

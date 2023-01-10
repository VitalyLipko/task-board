import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { iif, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UpdateUserInput, User } from '../../../core/graphql/graphql';
import { FormAbstractClass } from '../../../shared/abstract-classes/form.abstract-class';
import { confirmPasswordValidation } from '../../../shared/utils/confirm-password-validation';
import { UsersService } from '../users.service';

import { UserModalFormType } from './user-modal-form.type';

@Component({
  selector: 'tb-user-modal',
  templateUrl: './user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent
  extends FormAbstractClass<UserModalFormType>
  implements OnInit, OnDestroy
{
  user: User | undefined;

  private unsubscribe = new Subject<void>();

  @Input() tbId: string | undefined;

  constructor(
    private usersService: UsersService,
    public modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.tbId) {
      this.type = 'edit';
    }
    iif(
      () => !!this.tbId,
      this.usersService.getUserModalData(this.tbId as string),
      of(undefined),
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.createForm();
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    if (this.user) {
      this.modalRef.close({ ...this.changedValue, id: this.tbId });
    } else {
      const values = { ...this.form.getRawValue() };
      if ('confirmPassword' in values) {
        delete values.confirmPassword;
      }
      this.modalRef.close(values);
    }
  }

  private createForm(): void {
    if (this.user) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.form = new FormGroup({
        firstName: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
        lastName: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }),
      });
      const value = Object.keys(this.form.controls).reduce((acc, key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return { ...acc, [key]: this.user.profile[key] };
      }, {} as UpdateUserInput);
      this.form.setValue(value);
      this.initialValues = { ...value };
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.form = new FormGroup({
        username: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
        firstName: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
        lastName: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
        password: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
        confirmPassword: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }),
      });
      this.form.addValidators(confirmPasswordValidation);
    }
  }
}

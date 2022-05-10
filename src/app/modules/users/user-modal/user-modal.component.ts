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

import { User } from '../../../core/graphql/graphql';
import { FormAbstractClass } from '../../../shared/abstract-classes/form.abstract-class';
import { confirmPasswordValidation } from '../../../shared/utils/confirm-password-validation';
import { UsersService } from '../users.service';

@Component({
  selector: 'tb-user-modal',
  templateUrl: './user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent
  extends FormAbstractClass
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
      const values = { ...this.form.value };
      delete values.confirmPassword;

      this.modalRef.close(values);
    }
  }

  private createForm(): void {
    if (this.user) {
      this.form = new FormGroup({
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
      });
      const value: Record<string, unknown> = {};
      Object.keys(this.form.controls).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value[key] = this.user.profile[key];
      });
      this.form.setValue(value);
      this.initialValues = { ...value };
    } else {
      this.form = new FormGroup({
        username: new FormControl(null, Validators.required),
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required),
        confirmPassword: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
      });
      this.form.addValidators(confirmPasswordValidation);
    }
  }
}

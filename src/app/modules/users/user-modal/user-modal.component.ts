import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import isEmpty from 'lodash/isEmpty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { iif, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../../core/graphql/graphql';
import { UsersService } from '../users.service';

@Component({
  selector: 'tb-user-modal',
  templateUrl: './user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  user: User | undefined;

  private unsubscribe = new Subject<void>();

  get disabled(): boolean {
    return this.tbId
      ? this.form?.invalid || isEmpty(this.result)
      : this.form.invalid;
  }

  get result(): Record<string, unknown> | null {
    if (!this.form) {
      return null;
    }

    const result: Record<string, unknown> = {};
    Object.entries(this.form.value).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (value !== this.user[key]) {
        result[key] = value;
      }
    });

    return result;
  }

  @Input() tbId: string | undefined;

  constructor(
    private usersService: UsersService,
    public modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    iif(
      () => !!this.tbId,
      this.usersService.getUserModalData(this.tbId as string),
      of(undefined),
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (user) => {
          this.user = user;
          this.createForm();
          this.cdr.markForCheck();
        },
        (err) => this.messageService.error(err.message),
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    if (this.user) {
      const result: Record<string, unknown> = {};
      Object.entries(this.form.value).forEach(([key, value]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (value !== this.user[key]) {
          result[key] = value;
        }
      });
      this.modalRef.close({ ...result, id: this.tbId });
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
        value[key] = this.user[key];
      });
      this.form.setValue(value);
    } else {
      this.form = new FormGroup({
        username: new FormControl(null, Validators.required),
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required),
        confirmPassword: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
      });
      this.form.addValidators(UserModalComponent.confirmPasswordValidation);
    }
  }

  private static confirmPasswordValidation(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ confirmPassword: true });
      return { confirmPassword: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../core/graphql/graphql';
import { LayoutService } from '../../core/layout/layout.service';
import { FormAbstractClass } from '../../shared/abstract-classes/form.abstract-class';

import { ProfileService } from './profile.service';

@Component({
  selector: 'tb-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent
  extends FormAbstractClass
  implements OnInit, OnDestroy
{
  user: User | undefined;
  loading = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private layoutService: LayoutService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {
    super('edit');

    this.layoutService.pageHeaderExtra = null;
    this.layoutService.title =
      this.translocoService.translate('profile.profile');
  }

  ngOnInit(): void {
    this.profileService
      .getProfile()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.form = new FormGroup({
            avatar: new FormControl(this.user.profile.avatar),
            firstName: new FormControl(this.user.firstName, [
              Validators.required,
            ]),
            lastName: new FormControl(this.user.lastName, [
              Validators.required,
            ]),
            email: new FormControl(this.user.email, [Validators.email]),
          });
          this.initialValues = { ...this.form.value };
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleSave(): void {
    if (this.user) {
      this.loading = true;
      const user = { ...this.changedValue, id: this.user.id };
      this.profileService
        .updateProfile(user)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: () => {
            this.loading = false;
            this.initialValues = { ...this.form.value };
            this.form.reset(this.form.value);
            this.messageService.success(
              this.translocoService.translate('profile.profile_updated'),
            );
          },
          error: (err) => {
            this.messageService.error(err.message);
            this.loading = false;
          },
        });
    }
  }

  handleReset(): void {
    if (this.user) {
      this.form.reset({
        avatar: this.user.profile.avatar,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
      });
    }
  }
}

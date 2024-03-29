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

import { Profile, User } from '../../core/graphql/graphql';
import { LayoutService } from '../../core/layout/layout.service';
import {
  ControlsType,
  FormAbstractClass,
} from '../../shared/abstract-classes/form.abstract-class';

import { ProfileForm } from './profile-form.type';
import { ProfileService } from './profile.service';

@Component({
  selector: 'tb-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .tb-profile-container {
        width: 100%;
      }
    `,
  ],
})
export class ProfileComponent
  extends FormAbstractClass<ProfileForm>
  implements OnInit, OnDestroy
{
  user: User | undefined;
  profile: Profile | undefined;
  loading = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private layoutService: LayoutService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {
    super();
    this.type = 'edit';
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
          const { profile } = user;
          this.user = user;
          this.profile = profile;
          this.form = new FormGroup<ControlsType<ProfileForm>>({
            avatar: new FormControl(this.profile.avatar),
            firstName: new FormControl(this.profile.firstName, {
              validators: [Validators.required],
              nonNullable: true,
            }),
            lastName: new FormControl(this.profile.lastName, {
              validators: [Validators.required],
              nonNullable: true,
            }),
            email: new FormControl(this.profile.email, {
              validators: [Validators.required, Validators.email],
              nonNullable: true,
            }),
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
          },
          error: (err) => {
            this.messageService.error(err.message);
            this.loading = false;
          },
        });
    }
  }

  handleReset(): void {
    if (this.profile) {
      this.form.reset({
        avatar: this.profile.avatar,
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        email: this.profile.email,
      });
    }
  }

  onChangePassword(): void {
    this.profileService.changePasswordModal();
  }
}

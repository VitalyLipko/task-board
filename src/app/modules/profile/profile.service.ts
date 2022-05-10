import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UpdateProfileInput, User } from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import ChangePassword from './graphql/change-password.mutation.graphql';
import GetProfile from './graphql/get-profile.query.graphql';
import UpdateProfile from './graphql/update-profile.mutation.graphql';

@Injectable()
export class ProfileService {
  private readonly translations = {
    changePassword: this.translocoService.translate('profile.change_password'),
    cancel: this.translocoService.translate('common.cancel'),
    save: this.translocoService.translate('common.save'),
    profileUpdated: this.translocoService.translate('profile.profile_updated'),
    passwordChanged: this.translocoService.translate(
      'profile.password_changed',
    ),
  };
  constructor(
    private apollo: Apollo,
    private modalService: NzModalService,
    private translocoService: TranslocoService,
    private messageService: NzMessageService,
  ) {}

  getProfile(): Observable<User> {
    return this.apollo
      .watchQuery<{ user: User }>({ query: GetProfile })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data.user),
      );
  }

  updateProfile(user: UpdateProfileInput): Observable<void> {
    return this.apollo
      .mutate<{ user: User }>({
        mutation: UpdateProfile,
        variables: { user },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        errorHandler(),
        map(() => {
          this.messageService.success(this.translations.profileUpdated);
        }),
      );
  }

  changePasswordModal() {
    const options: ModalOptions<ChangePasswordModalComponent> = {
      nzTitle: this.translations.changePassword,
      nzContent: ChangePasswordModalComponent,
      nzMaskClosable: false,
      nzFooter: [
        {
          label: this.translations.cancel,
          onClick: (contentComponentInstance) =>
            contentComponentInstance?.modalRef.close(),
        },
        {
          label: this.translations.save,
          type: 'primary',
          disabled: (contentComponentInstance) =>
            !contentComponentInstance?.canSubmit,
          onClick: (contentComponentInstance) =>
            contentComponentInstance?.onSubmit(),
        },
      ],
    };
    this.modalService.create(options);
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<void> {
    return this.apollo
      .mutate<{ changePassword: boolean }>({
        mutation: ChangePassword,
        variables: { currentPassword, newPassword },
      })
      .pipe(
        errorHandler(),
        map(() => {
          this.messageService.success(this.translations.passwordChanged);
        }),
      );
  }
}

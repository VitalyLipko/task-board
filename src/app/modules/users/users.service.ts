import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import {
  CreateUserInput,
  UpdateUserInput,
  User,
} from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import CreateUser from './graphql/create-user.mutation.graphql';
import DeleteUser from './graphql/delete-user.mutation.graphql';
import GetUserModalData from './graphql/get-user-modal-data.query.graphql';
import GetUsersPageData from './graphql/get-users-page-data.query.graphql';
import UpdateUser from './graphql/update-user.mutation.graphql';
import { UserModalComponent } from './user-modal/user-modal.component';

@Injectable()
export class UsersService {
  private readonly translations = {
    createUser: this.translocoService.translate('user.create_user'),
    cancel: this.translocoService.translate('common.cancel'),
    create: this.translocoService.translate('common.create'),
    userCreated: this.translocoService.translate('user.user_created'),
    editUser: this.translocoService.translate('user.edit_user'),
    save: this.translocoService.translate('common.save'),
    userUpdated: this.translocoService.translate('user.user_updated'),
    delete: this.translocoService.translate('common.delete'),
    userDeleted: this.translocoService.translate('user.user_deleted'),
  };
  constructor(
    private apollo: Apollo,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private translocoService: TranslocoService,
  ) {}

  getUsersPageData(): Observable<{ users: Array<User>; user: User }> {
    return this.apollo
      .watchQuery<{ users: Array<User>; user: User }>({
        query: GetUsersPageData,
      })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data),
      );
  }

  getUserModalData(id: string): Observable<User> {
    return this.apollo
      .query<{ user: User }>({
        query: GetUserModalData,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data.user),
      );
  }

  create(): Observable<void> {
    const options: ModalOptions<UserModalComponent, CreateUserInput> = {
      nzTitle: this.translations.createUser,
      nzMaskClosable: false,
      nzContent: UserModalComponent,
      nzFooter: [
        {
          label: this.translations.cancel,
          onClick(contentComponentInstance: UserModalComponent) {
            contentComponentInstance.modalRef.close();
          },
        },
        {
          label: this.translations.create,
          type: 'primary',
          disabled: (contentComponentInstance) =>
            !!contentComponentInstance?.form.invalid,
          onClick(contentComponentInstance: UserModalComponent) {
            contentComponentInstance.onSubmit();
          },
        },
      ],
    };
    return this.modalService
      .create(options)
      .afterClose.asObservable()
      .pipe(
        filter((res) => !!res),
        switchMap((user) =>
          this.apollo.mutate<{ createUser: User }, { user: CreateUserInput }>({
            mutation: CreateUser,
            variables: { user },
            update(cache, { data }) {
              const newUser = data?.createUser;
              const existingUsers = cache.readQuery<{
                users: Array<User>;
                user: User;
              }>({ query: GetUsersPageData });

              if (newUser && existingUsers) {
                const users = [...existingUsers.users, newUser].sort((a, b) =>
                  a.fullName.localeCompare(b.fullName),
                );
                cache.writeQuery<{
                  users: Array<User>;
                  user: User;
                }>({
                  query: GetUsersPageData,
                  data: { users, user: existingUsers.user },
                });
              }
            },
          }),
        ),
        errorHandler(),
        map(() => {
          this.messageService.success(this.translations.userCreated);
        }),
      );
  }

  edit(id: string): Observable<void> {
    const options: ModalOptions<UserModalComponent, UpdateUserInput> = {
      nzTitle: this.translations.editUser,
      nzMaskClosable: false,
      nzContent: UserModalComponent,
      nzComponentParams: { tbId: id },
      nzFooter: [
        {
          label: this.translations.cancel,
          onClick(contentComponentInstance: UserModalComponent) {
            contentComponentInstance.modalRef.close();
          },
        },
        {
          label: this.translations.save,
          type: 'primary',
          disabled: (contentComponentInstance) =>
            !contentComponentInstance?.form ||
            !contentComponentInstance?.canSubmit,
          onClick(contentComponentInstance: UserModalComponent) {
            contentComponentInstance.onSubmit();
          },
        },
      ],
    };
    return this.modalService
      .create(options)
      .afterClose.asObservable()
      .pipe(
        filter((res) => !!res),
        switchMap((user) =>
          this.apollo.mutate({ mutation: UpdateUser, variables: { user } }),
        ),
        errorHandler(),
        map(() => {
          this.messageService.success(this.translations.userUpdated);
        }),
      );
  }

  delete(user: User): Observable<void> {
    return this.modalService
      .confirm({
        nzTitle: this.translocoService.translate('common.delete_entity', {
          entity: user.fullName,
        }),
        nzMaskClosable: false,
        nzOkDanger: true,
        nzOkText: this.translations.delete,
        nzOnOk: () => true,
      })
      .afterClose.asObservable()
      .pipe(
        filter((res) => !!res),
        switchMap(() =>
          this.apollo.mutate<{ deleteUser: boolean }>({
            mutation: DeleteUser,
            variables: { id: user.id },
            update(cache, { data }) {
              if (data?.deleteUser) {
                const existingUsers = cache.readQuery<{
                  users: Array<User>;
                  user: User;
                }>({ query: GetUsersPageData });

                if (existingUsers) {
                  const users = existingUsers.users.filter(
                    ({ id }) => id !== user.id,
                  );
                  cache.writeQuery<{
                    users: Array<User>;
                    user: User;
                  }>({
                    query: GetUsersPageData,
                    data: { users, user: existingUsers.user },
                  });
                }
              }
            },
          }),
        ),
        errorHandler(),
        map(() => {
          this.messageService.success(this.translations.userDeleted);
        }),
      );
  }
}

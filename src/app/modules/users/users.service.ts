import { Injectable } from '@angular/core';
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
  constructor(
    private apollo: Apollo,
    private modalService: NzModalService,
    private messageService: NzMessageService,
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
      nzTitle: 'Create user',
      nzMaskClosable: false,
      nzContent: UserModalComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick(contentComponentInstance: UserModalComponent) {
            contentComponentInstance.modalRef.close();
          },
        },
        {
          label: 'Create',
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
          this.messageService.success('User created');
        }),
      );
  }

  edit(id: string): Observable<void> {
    const options: ModalOptions<UserModalComponent, UpdateUserInput> = {
      nzTitle: 'Edit user',
      nzMaskClosable: false,
      nzContent: UserModalComponent,
      nzComponentParams: { tbId: id },
      nzFooter: [
        {
          label: 'Cancel',
          onClick(contentComponentInstance: UserModalComponent) {
            contentComponentInstance.modalRef.close();
          },
        },
        {
          label: 'Save',
          type: 'primary',
          disabled: (contentComponentInstance) =>
            !!contentComponentInstance?.disabled,
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
          this.messageService.success('User updated');
        }),
      );
  }

  delete(user: User): Observable<void> {
    return this.modalService
      .confirm({
        nzTitle: `Delete ${user.fullName}?`,
        nzMaskClosable: false,
        nzOkDanger: true,
        nzOkText: 'Delete',
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
          this.messageService.success('User deleted');
        }),
      );
  }
}

import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import CreateProject from './graphql/create-project.mutation.graphql';
import DeleteProject from './graphql/delete-project.mutation.graphql';
import GetProject from './graphql/get-project.query.graphql';
import GetProjects from './graphql/get-projects.query.graphql';
import UpdateProject from './graphql/update-project.mutation.graphql';
import { ProjectModalComponent } from './project-modal/project-modal.component';

@Injectable()
export class ProjectsService {
  private readonly translations = {
    createProject: this.translocoService.translate('project.create_project'),
    create: this.translocoService.translate('common.create'),
    cancel: this.translocoService.translate('common.cancel'),
    projectCreated: this.translocoService.translate('project.project_created'),
    save: this.translocoService.translate('common.save'),
    editProject: this.translocoService.translate('project.edit_project'),
    projectUpdated: this.translocoService.translate('project.project_updated'),
    delete: this.translocoService.translate('common.delete'),
    projectDeleted: this.translocoService.translate('project.project_deleted'),
  };

  constructor(
    private apollo: Apollo,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private translocoService: TranslocoService,
  ) {}

  getProjects(): Observable<Project[]> {
    return this.apollo
      .watchQuery<{ projects: Array<Project> }>({ query: GetProjects })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data.projects),
      );
  }

  getProject(id: string): Observable<Project> {
    return this.apollo
      .query<{ project: Project }>({
        query: GetProject,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data.project),
      );
  }

  create(): Observable<void> {
    const options: ModalOptions<ProjectModalComponent, CreateProjectInput> = {
      nzTitle: this.translations.createProject,
      nzMaskClosable: false,
      nzContent: ProjectModalComponent,
      nzFooter: [
        {
          label: this.translations.cancel,
          onClick(contentComponentInstance?: ProjectModalComponent) {
            contentComponentInstance?.modalRef.close();
          },
        },
        {
          label: this.translations.create,
          type: 'primary',
          disabled: (contentComponentInstance) =>
            !contentComponentInstance?.canSubmit,
          onClick(contentComponentInstance?: ProjectModalComponent) {
            contentComponentInstance?.onSubmit();
          },
        },
      ],
    };
    return this.modalService
      .create(options)
      .afterClose.asObservable()
      .pipe(
        filter((res) => !!res),
        switchMap((project) =>
          this.apollo.mutate<{ createProject: Project }>({
            mutation: CreateProject,
            variables: { project },
            context: {
              useMultipart: true,
            },
            update(cache, { data }) {
              const newProject = data?.createProject;
              const existingProjects = cache.readQuery<{
                projects: Array<Project>;
              }>({
                query: GetProjects,
              });

              if (newProject && existingProjects) {
                const projects = [
                  ...existingProjects.projects,
                  newProject,
                ].sort((a, b) => a.name.localeCompare(b.name));
                cache.writeQuery<{ projects: Array<Project> }>({
                  query: GetProjects,
                  data: {
                    projects,
                  },
                });
              }
            },
          }),
        ),
        errorHandler(),
        map(() => {
          this.messageService.success(this.translations.projectCreated);
        }),
      );
  }

  edit(id: string): Observable<void> {
    const options: ModalOptions<ProjectModalComponent, UpdateProjectInput> = {
      nzTitle: this.translations.editProject,
      nzMaskClosable: false,
      nzContent: ProjectModalComponent,
      nzComponentParams: { tbId: id },
      nzFooter: [
        {
          label: this.translations.cancel,
          onClick(contentComponentInstance?: ProjectModalComponent) {
            contentComponentInstance?.modalRef.close();
          },
        },
        {
          label: this.translations.save,
          type: 'primary',
          disabled: (contentComponentInstance) =>
            !!contentComponentInstance?.disabled,
          onClick(contentComponentInstance?: ProjectModalComponent) {
            contentComponentInstance?.onSubmit();
          },
        },
      ],
    };

    return this.modalService
      .create(options)
      .afterClose.asObservable()
      .pipe(
        filter((res) => !!res),
        switchMap((project) =>
          this.apollo.mutate({
            mutation: UpdateProject,
            variables: { project },
            context: {
              useMultipart: true,
            },
          }),
        ),
        errorHandler(),
        map(() => {
          this.messageService.success(this.translations.projectUpdated);
        }),
      );
  }

  delete({ id, name }: Project): Observable<void> {
    return this.modalService
      .confirm({
        nzTitle: this.translocoService.translate('common.delete_entity', {
          entity: name,
        }),
        nzMaskClosable: false,
        nzOkDanger: true,
        nzOkText: this.translations.delete,
        nzOnOk: () => true,
      })
      .afterClose.asObservable()
      .pipe(
        filter(Boolean),
        switchMap(() =>
          this.apollo.mutate<{ deleteProject: boolean }>({
            mutation: DeleteProject,
            variables: { id },
            update(cache, { data }) {
              const isDeleted = !!data?.deleteProject;
              const existingProjects = cache.readQuery<{
                projects: Array<Project>;
              }>({
                query: GetProjects,
              });
              if (isDeleted && existingProjects) {
                const filteredProjects = existingProjects.projects.filter(
                  (project) => project.id !== id,
                );
                cache.writeQuery<{ projects: Array<Project> }>({
                  query: GetProjects,
                  data: {
                    projects: filteredProjects,
                  },
                });
              }
            },
          }),
        ),
        map(({ data }) => {
          if (data?.deleteProject) {
            this.messageService.success(this.translations.projectDeleted);
          }
        }),
      );
  }
}

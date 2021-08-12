import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { CreateProjectInput, Project } from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import CreateProject from './operations/create-project.graphql';
import GetProjects from './operations/get-projects.query.graphql';
import { ProjectModalComponent } from './project-modal/project-modal.component';

@Injectable()
export class ProjectService {
  constructor(
    private apollo: Apollo,
    private modalService: NzModalService,
    private messageService: NzMessageService,
  ) {}

  getProjects(): Observable<Project[]> {
    return this.apollo
      .watchQuery<{ projects: Array<Project> }>({ query: GetProjects })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data.projects),
      );
  }

  create(): Observable<void> {
    const options: ModalOptions<ProjectModalComponent, CreateProjectInput> = {
      nzTitle: 'Create project',
      nzMaskClosable: false,
      nzContent: ProjectModalComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick(contentComponentInstance?: ProjectModalComponent) {
            contentComponentInstance?.modalRef.close();
          },
        },
        {
          label: 'Create',
          type: 'primary',
          disabled: (contentComponentInstance) =>
            !!contentComponentInstance?.form.invalid,
          onClick(contentComponentInstance?: ProjectModalComponent) {
            contentComponentInstance?.modalRef.close(
              contentComponentInstance?.form.value,
            );
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
          this.messageService.success('Project created');
        }),
      );
  }
}

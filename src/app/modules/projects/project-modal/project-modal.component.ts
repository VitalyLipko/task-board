import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { iif, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Project } from '../../../core/graphql/graphql';
import {
  ControlsType,
  FormAbstractClass,
} from '../../../shared/abstract-classes/form.abstract-class';
import { ProjectsService } from '../projects.service';

import { ProjectFormType } from './project-form.type';

@Component({
  selector: 'tb-project-modal',
  templateUrl: './project-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectModalComponent
  extends FormAbstractClass<ProjectFormType>
  implements OnInit, OnDestroy
{
  project: Project | undefined;

  private unsubscribe = new Subject<void>();

  @Input() tbId: string | undefined;

  constructor(
    public modalRef: NzModalRef,
    private projectsService: ProjectsService,
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
      this.projectsService.getProject(this.tbId as string),
      of(undefined),
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (project) => {
          this.project = project;
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
    if (this.project) {
      this.modalRef.close({ ...this.changedValue, id: this.tbId });
    } else {
      this.modalRef.close(this.changedValue);
    }
  }

  private createForm(): void {
    this.form = new FormGroup<ControlsType<ProjectFormType>>({
      name: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      icon: new FormControl<File | null>(null),
    });

    if (this.project) {
      this.form.setValue({ name: this.project.name, icon: this.project.icon });
      this.initialValues = { ...this.form.value };
    }
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { iif, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Project } from '../../../core/graphql/graphql';
import { FormAbstractClass } from '../../../shared/abstract-classes/form.abstract-class';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'tb-project-modal',
  templateUrl: './project-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectModalComponent
  extends FormAbstractClass
  implements OnInit, OnDestroy
{
  project: Project | undefined;

  private unsubscribe = new Subject<void>();

  @Input() tbId: string | undefined;

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
      if (value !== this.project[key]) {
        result[key] = value;
      }
    });

    return result;
  }

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
      const values: Record<string, unknown> = {};
      Object.entries(this.form.value).forEach(([key, value]) => {
        if (value) {
          values[key] = value;
        }
      });
      this.modalRef.close(values);
    }
  }

  private createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      icon: new FormControl(),
    });

    if (this.project) {
      this.form.setValue({ name: this.project.name, icon: this.project.icon });
      this.initialValues = { ...this.form.value };
    }
  }
}

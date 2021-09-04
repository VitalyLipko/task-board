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
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'tb-project-modal',
  templateUrl: './project-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  project: Project | undefined;

  private unsubscribe = new Subject<void>();

  @Input() tbId: string | undefined;

  get disabled(): boolean {
    return this.project
      ? this.project?.name === this.form.get('name')?.value
      : this.form?.invalid;
  }

  constructor(
    public modalRef: NzModalRef,
    private projectsService: ProjectsService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    iif(
      () => !!this.tbId,
      this.projectsService.getProject(this.tbId as string),
      of(undefined),
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (project) => {
          this.project = project;
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
    this.modalRef.close({
      ...this.form.value,
      ...(this.tbId && { id: this.tbId }),
    });
  }

  private createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    if (this.project) {
      this.form.setValue({ name: this.project.name });
    }
  }
}

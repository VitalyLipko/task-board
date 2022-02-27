import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Project } from '../../../core/graphql/graphql';
import { LayoutService } from '../../../core/layout/layout.service';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'tb-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent implements AfterViewInit, OnInit, OnDestroy {
  projects: Array<Project> | undefined;

  private unsubscribe = new Subject<void>();

  @ViewChild('createButtonTemplate')
  private createButtonTemplate!: TemplateRef<void>;

  constructor(
    private apollo: Apollo,
    private layoutService: LayoutService,
    private projectsService: ProjectsService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.projectsService
      .getProjects()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (res) => {
          this.projects = res;
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  ngAfterViewInit(): void {
    this.layoutService.pageHeaderExtra = this.createButtonTemplate;
    this.layoutService.title =
      this.translocoService.translate('common.projects');
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  trackByFn(_: number, item: Project): string {
    return item.id;
  }

  onCreate(): void {
    this.projectsService.create().pipe(takeUntil(this.unsubscribe)).subscribe();
  }

  handleDelete(project: Project): void {
    this.projectsService
      .delete(project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({ error: (err) => this.messageService.error(err.message) });
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Project } from '../../../core/graphql/graphql';
import { LayoutService } from '../../../shared/layout/layout.service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'tb-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent implements AfterViewInit, OnInit {
  projects: Array<Project> | undefined;

  private unsubscribe = new Subject<void>();

  @ViewChild('createButtonTemplate')
  private createButtonTemplate!: TemplateRef<void>;

  constructor(
    private apollo: Apollo,
    private layoutService: LayoutService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.projectService
      .getProjects()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (res) => {
          this.projects = res;
          this.cdr.markForCheck();
        },
        (err) => this.messageService.error(err.message),
      );
  }

  ngAfterViewInit(): void {
    this.layoutService.pageHeaderExtra = this.createButtonTemplate;
    this.layoutService.title = 'Projects';
  }

  trackByFn(_: number, item: Project): string {
    return item.id;
  }

  onCreate(): void {
    this.projectService.create().pipe(takeUntil(this.unsubscribe)).subscribe();
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { Project } from '../../../core/graphql/graphql';
import { stringToColor } from '../../../shared/utils/string-to-color';

@Component({
  selector: 'tb-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  @Input() tbProject!: Project;

  @Output() tbDelete = new EventEmitter<string>();

  get backgroundColor(): string {
    return stringToColor(this.tbProject.name);
  }

  handleDelete(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.tbDelete.emit(this.tbProject.id);
  }
}

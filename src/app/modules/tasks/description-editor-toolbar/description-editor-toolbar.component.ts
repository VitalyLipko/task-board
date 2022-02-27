import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Editor } from '@tiptap/core';

interface ToolbarAction {
  icon: string;
  tooltip: string;
  isActive: () => boolean;
  action: (event: MouseEvent) => void;
}

@Component({
  selector: 'tb-description-editor-toolbar',
  templateUrl: './description-editor-toolbar.component.html',
  styleUrls: ['./description-editor-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionEditorToolbarComponent implements OnInit, OnDestroy {
  actions: Array<ToolbarAction> = [
    {
      icon: 'bold',
      tooltip: this.translocoService.translate('task.editor.bold'),
      isActive: (): boolean => this.tbEditor.isActive('bold'),
      action: (event: MouseEvent): void => {
        event.preventDefault();
        this.tbEditor.chain().focus().toggleBold().run();
      },
    },
    {
      icon: 'italic',
      tooltip: this.translocoService.translate('task.editor.italic'),
      isActive: (): boolean => this.tbEditor.isActive('italic'),
      action: (event: MouseEvent): void => {
        event.preventDefault();
        this.tbEditor.chain().focus().toggleItalic().run();
      },
    },
    {
      icon: 'strikethrough',
      tooltip: this.translocoService.translate('task.editor.strike'),
      isActive: (): boolean => this.tbEditor.isActive('strike'),
      action: (event: MouseEvent): void => {
        event.preventDefault();
        this.tbEditor.chain().focus().toggleStrike().run();
      },
    },
  ];

  @Input() tbEditor!: Editor;

  constructor(
    private cdr: ChangeDetectorRef,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.tbEditor.on('transaction', () => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.tbEditor.off('transaction');
  }
}

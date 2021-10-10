import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
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
      tooltip: 'Bold',
      isActive: (): boolean => this.tbEditor.isActive('bold'),
      action: (event: MouseEvent): void => {
        event.preventDefault();
        this.tbEditor.chain().focus().toggleBold().run();
      },
    },
    {
      icon: 'italic',
      tooltip: 'Italic',
      isActive: (): boolean => this.tbEditor.isActive('italic'),
      action: (event: MouseEvent): void => {
        event.preventDefault();
        this.tbEditor.chain().focus().toggleItalic().run();
      },
    },
    {
      icon: 'strikethrough',
      tooltip: 'Strike',
      isActive: (): boolean => this.tbEditor.isActive('strike'),
      action: (event: MouseEvent): void => {
        event.preventDefault();
        this.tbEditor.chain().focus().toggleStrike().run();
      },
    },
  ];

  @Input() tbEditor!: Editor;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.tbEditor.on('transaction', () => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.tbEditor.off('transaction');
  }
}

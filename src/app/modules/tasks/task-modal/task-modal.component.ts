import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tb-task-modal',
  templateUrl: './task-modal.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModalComponent {
  form = new FormGroup({
    title: new FormControl(null, Validators.required),
  });

  constructor(public modalRef: NzModalRef) {}

  onSubmit(): void {
    this.modalRef.close(this.form.value);
  }
}

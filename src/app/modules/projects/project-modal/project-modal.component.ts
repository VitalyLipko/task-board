import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tb-project-modal',
  templateUrl: './project-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectModalComponent {
  form = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public modalRef: NzModalRef) {}

  onSubmit(): void {
    this.modalRef.close(this.form.value);
  }
}

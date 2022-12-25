import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { FormAbstractClass } from '../../shared/abstract-classes/form.abstract-class';

@Component({
  selector: 'tb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends FormAbstractClass implements OnDestroy {
  loading = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private apollo: Apollo,
    private router: Router,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    super();
    this.form = new UntypedFormGroup({
      username: new UntypedFormControl(null, Validators.required),
      password: new UntypedFormControl(null, Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleSubmit(): void {
    this.loading = true;
    this.authService
      .login(this.form.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: (err) => {
          this.loading = false;
          this.messageService.error(err.message);
          this.cdr.markForCheck();
        },
      });
  }
}

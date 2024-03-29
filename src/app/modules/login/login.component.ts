import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MutationLoginArgs } from '../../core/graphql/graphql';
import { AuthService } from '../../core/services/auth.service';
import { FormAbstractClass } from '../../shared/abstract-classes/form.abstract-class';

@Component({
  selector: 'tb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent
  extends FormAbstractClass<MutationLoginArgs>
  implements OnDestroy
{
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
    this.form = new FormGroup({
      username: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleSubmit(): void {
    this.loading = true;
    this.authService
      .login(this.form.getRawValue())
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

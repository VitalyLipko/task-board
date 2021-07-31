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
import { errorHandler } from 'src/app/core/operators';

import Login from './login.mutation.graphql';

@Component({
  selector: 'tb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  loginForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
  loading = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private apollo: Apollo,
    private router: Router,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleSubmit(): void {
    this.loading = true;
    this.apollo
      .mutate({ mutation: Login, variables: this.loginForm.value })
      .pipe(errorHandler(), takeUntil(this.unsubscribe))
      .subscribe(
        () => this.router.navigate(['projects']),
        (err) => {
          this.loading = false;
          this.messageService.error(err.message);
          this.cdr.markForCheck();
        },
      );
  }
}

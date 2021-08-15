import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GraphQLModule } from './graphql/graphql.module';
import { WithCredentialsInterceptor } from './interceptors/with-credentials.interceptor';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, GraphQLModule, BrowserAnimationsModule],
  exports: [GraphQLModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
    AuthService,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

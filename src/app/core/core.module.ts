import { CommonModule } from '@angular/common';
import { NgModule, SkipSelf, Optional } from '@angular/core';

import { GraphQLModule } from './graphql/graphql.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, GraphQLModule],
  exports: [GraphQLModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

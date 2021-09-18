import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApplicationComponent } from './application.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent, ApplicationComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule],
  bootstrap: [AppComponent],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class AppModule {}

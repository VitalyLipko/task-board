import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LayoutService {
  private readonly _pageHeaderExtra =
    new BehaviorSubject<TemplateRef<void> | null>(null);
  private readonly _title = new BehaviorSubject<string | null>(null);

  readonly pageHeaderExtra$ = this._pageHeaderExtra.asObservable();
  readonly title$ = this._title.asObservable();

  set pageHeaderExtra(value: TemplateRef<void> | null) {
    this._pageHeaderExtra.next(value);
  }

  set title(value: string) {
    this._title.next(value);
  }
}

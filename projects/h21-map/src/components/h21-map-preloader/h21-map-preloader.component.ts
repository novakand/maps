import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';

// external libs
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// components
import { H21MapComponent } from '../h21-map/h21-map.component';

@Component({
  selector: 'h21-map-preloader',
  templateUrl: './h21-map-preloader.component.html',
  styleUrls: ['./h21-map-preloader.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapPreloaderComponent implements OnInit, OnDestroy {

  @Input() public isShowPreloader = true;

  private _destroy$ = new Subject<boolean>();

  constructor(
    @ViewChild(H21MapComponent) private _map: H21MapComponent
  ) { }

  public ngOnInit(): void {
    this.isShowPreloader = true;
    this._mapReady();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  private _mapReady(): void {
    this._map.mapReady
    .pipe(
      filter(Boolean),
      takeUntil(this._destroy$),
    )
    .subscribe({ next: () => this.isShowPreloader = false });

    this._map.updateReady
    .pipe(takeUntil(this._destroy$))
    .subscribe({ next: () => this.isShowPreloader = false });

    this._map.providerChange
    .pipe(takeUntil(this._destroy$))
    .subscribe({ next: () => this.isShowPreloader = true });
  }

}

import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

// external libs
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// enum
import { ZoomControlPosition } from '../../enums/zoom-control-position.enum';

// services
import { MapManager } from '../../manager/map-manager';

// component
import { H21MapComponent } from '../h21-map/h21-map.component';

@Component({
  selector: 'h21-map-zoom-control',
  templateUrl: './h21-map-zoom-control.component.html',
  styleUrls: ['./h21-map-zoom-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapZoomControlComponent implements OnInit, OnDestroy {

  @Input() public isShowZoomControl = true;
  @Input() public isDisableZoomControl = false;
  @Input() public isResetZoomControl = true;
  @Input() public isDisabledZoomOut = false;
  @Input() public isDisabledZoomIn = false;
  @Input() public tooltipZoomIn = 'Increase';
  @Input() public tooltipZoomOut = 'Diminish';
  @Input() public positionControl = ZoomControlPosition.center;

  private _destroy$ = new Subject<boolean>();

  constructor(
    public manager: MapManager,
    @ViewChild(H21MapComponent) private _map: H21MapComponent,
  ) { }

  public ngOnInit(): void {
    this._changeZoom();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this.manager.destroy();
  }

  public onZoomOutChange(): void {
    this.manager.getMap().setZoomOut();
    this._onZoomChange();
  }

  public onZoomInChange(): void {
    this.manager.getMap().setZoomIn();
    this._onZoomChange();
  }

  private _onZoomChange() {
    const currentZoom = this.manager.getMap().getZoom();
    currentZoom === this.manager.getMap().getMinZoom() ?
      this.isDisabledZoomOut = true :
      this.isDisabledZoomOut = false;

    currentZoom === this.manager.getMap().getMaxZoom() ?
      this.isDisabledZoomIn = true :
      this.isDisabledZoomIn = false;
  }

  private _changeZoom() {
    this._map.zoomChange
    .pipe(takeUntil(this._destroy$))
    .subscribe({ next: () => this._onZoomChange() });
  }

}

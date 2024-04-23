import {
  Directive,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange
} from '@angular/core';

// external libs
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { MapManager } from '../manager/map-manager';

@Directive({
  selector: '[h21MapCluster]',
})
export class H21MapClusterDirective implements OnInit, OnChanges, OnDestroy {

  @Input() public gridSize = 200;
  @Input() public maxZoom = 18;
  @Input() public textColor = 'black';
  @Input() public iconZIndex = 10000;
  @Input() public iconHoverZIndex = 10001;
  @Input() public zoomOnClick = true;
  @Input() public minimumClusterSize = 3;
  @Input() public iconUrl = 'https://svgshare.com/i/CT5.svg';
  @Input() public width = 54;
  @Input() public height = 54;

  @Output() public clusterClick: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public clusterMouseOver: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public clusterMouseOut: Subject<MouseEvent> = new Subject<MouseEvent>();

  private _clusterAddService: boolean;
  private _destroy$ = new Subject<boolean>();

  constructor(private _manager: MapManager, private _zone: NgZone) { }

  public ngOnInit(): void { this.onInit(); }

  public onInit(): void {
    this._manager.getMap().loadMap$
      .pipe(
        filter(Boolean),
        takeUntil(this._destroy$),
      )
      .subscribe({
        next: () => { this._zone.run(() => this.initService()); },
      });
  }

  public ngOnDestroy(): void { this.onDestroy(); }

  public onDestroy(): void {
    this._manager.getMap().cluster.removeMarkers();
    this._destroy$.next(true);
    this._destroy$.complete();
    this._clusterAddService = false;
  }

  public initService(): void {
    if (!this._manager.getMap().cluster || !this._manager.getMap().loadMap$) { return; }
    if (!this._clusterAddService) {
      this._manager.getMap().cluster.initMarkerCluster(this);
      this._clusterAddService = true;
    }
  }

  public ngOnChanges(changes: { [key: string]: SimpleChange }): void {
    if (!this._clusterAddService) { return; }
    changes.gridSize && this._manager.getMap().cluster.setGridSize(this);
    changes.maxZoom && this._manager.getMap().cluster.setMaxZoom(this);
    changes.zoomOnClick && this._manager.getMap().cluster.setZoomOnClick(this);
    changes.iconUrl && this._manager.getMap().cluster.setIconUrl(this);
    changes.minimumClusterSize && this._manager.getMap().cluster.setMinimumClusterSize(this);
    (changes.width || changes.height) && this._manager.getMap().cluster.setIconSize(this);
  }

}

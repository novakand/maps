import {
  AfterViewInit,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
} from '@angular/core';

// external libs
import { Subject } from 'rxjs';

// enums
import { RouteMode } from '../enums/route-type.enum';
import { TypePoint } from '../enums/point-type.enum';

// services
import { MapManager } from '../manager/map-manager';
import { takeUntil } from 'rxjs/operators';

let routeId = 0;

@Directive({
  selector: '[h21MapRoute]',
})
export class H21MapRouteDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input() public startLatitude = 0;
  @Input() public startLongitude = 0;
  @Input() public endLatitude = 0;
  @Input() public endLongitude = 0;
  @Input() public startIconStaticUrl: string;
  @Input() public endIconStaticUrl: string;
  @Input() public routeMode: RouteMode;
  @Input() public routeFitBounds = false;
  @Input() public routeFillColor = '#0044d6';
  @Input() public routeFillOpacity = 0.08;
  @Input() public routeStrokeColor = '#0044d6';
  @Input() public routeStrokeOpacity = 0.9;
  @Input() public routeStrokeWeight = 4;
  @Input() public routePath: any[] = [];
  @Input() public typePoint: TypePoint;
  @Input() public geodesic = false;
  @Input() public autoTransit = false;

  @Output() public routeReady: Subject<any> = new Subject<any>();

  private readonly _id: string;
  private _routeAddService = false;
  private _destroy$ = new Subject<boolean>();

  constructor(private _manager: MapManager) { this._id = (routeId++).toString(); }

  public id(): string { return this._id; }

  public toString(): string { return `markerId-${this._id}`; }

  public ngAfterViewInit(): void { this.onInit(); }

  public onInit() {
    if (!this._manager.getMap().route) { return; }
    if (!this.startLatitude
      || !this.startLongitude
      || !this.endLongitude
      || !this.endLongitude) { return; }

    if (!this._routeAddService) {
      this._manager.getMap().route.getRoute(this);
      this._routeAddService = true;
      this._addEventListeners();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._manager.getMap().route.removeRoute(this);
  }

  public onDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._manager.getMap().route.removeRoutes();
  }

  public ngOnChanges(changes: { [key: string]: SimpleChange }): void {

    if (!this._manager.getMap().route) { return; }
    if (!this._routeAddService) { return; }

    if (typeof this.startLatitude !== 'number' ||
      typeof this.startLongitude !== 'number' ||
      typeof this.endLatitude !== 'number' ||
      typeof this.endLongitude !== 'number') { return; }

    if (!this.startLatitude
      || !this.startLongitude
      || !this.endLatitude
      || !this.endLongitude) { return; }

    if (changes.startLatitude
      || changes.startLongitude
      || changes.endLatitude
      || changes.endLongitude) {
      this._manager.getMap().route.getRoute(this);
    }
  }

  private _addEventListeners(): void {
    this._manager.getMap().route.routeReady
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((event: any) => {
        this.routeReady.next(event);
      });
  }

}

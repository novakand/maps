import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// libs
import { Geodesic } from '@h21-map/baidu-geodesic';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// enums
import { RouteMode } from '../../enums/route-type.enum';

// models
import { Position } from '../../models/position.model';
import { RouteInfo } from '../../models/route-info.model';
import { RoutePosition } from '../../models/route-position.models';

// services
import { RouteService } from '../abstract/abstract-route';
import { BaiduRouteCarService } from './baidu-route-car';
import { BaiduRouteFlyService } from './baidu-route-fly';
import { BaiduRouteRailsService } from './baidu-route-rail';
import { BaiduRouteTransitService } from './baidu-route-transit';
import { BaiduRouteWalkService } from './baidu-route-walk';

@Injectable()
export class BaiduRouteService extends RouteService<BMap.Map, BMap.Marker, BMap.Polyline> {

  public routes: Map<H21MapRouteDirective, BMap.Polyline> = new Map<H21MapRouteDirective, BMap.Polyline>();
  private _initRoute = false;

  constructor(
    public fly: BaiduRouteFlyService,
    public railway: BaiduRouteRailsService,
    public car: BaiduRouteCarService,
    public transit: BaiduRouteTransitService,
    public walk: BaiduRouteWalkService,
    private _zone: NgZone,
  ) {
    super();
    this.car.initRoute(this);
    this.railway.initRoute(this);
    this.fly.initRoute(this);
    this.walk.initRoute(this);
    this.transit.initRoute(this);
  }

  public getPatch(route: H21MapRouteDirective): Observable<BMap.Point[]> {
    return new Observable((observer) => {
      switch (route.routeMode) {
        case RouteMode.walking:
          observer.next(this.walk.getPath(route));
          break;
        case RouteMode.fly:
          observer.next(this.fly.getPath(route));
          break;
        case RouteMode.car:
          this.car.getPath(route).subscribe((latLng) => {
            observer.next(latLng);
          });
          break;
        case RouteMode.transit:
          observer.next(this.transit.getPath(route));
          break;
      }
    });
  }

  public buildRoute(route: H21MapRouteDirective, patch: BMap.Point[]): void {
    this.map.createPolyline(super.createRouteOptions(route)).subscribe((bRoute) => {
      this.routes.set(route, bRoute);
      if (patch) {
        this.addRoute(route, patch);
        if (route.routeFitBounds && patch.length) {
          this.fitBounds(route);
        }
      }
    });
  }

  public addRoute(route: H21MapRouteDirective, patch: BMap.Point[]) {
    this.map.api.addOverlay(this.routes.get(route));
    if (patch.length) {
      this.routes.get(route).setPath(patch);
    }
  }

  public createRoute(route: H21MapRouteDirective): Observable<BMap.DrivingRouteResult> {
    return new Observable((observer: Observer<any>) => {
      const directionsService: BMap.TransitRoute = new BMap.TransitRoute(this.map.api);
      directionsService.search(new BMap.Point(route.startLongitude, route.startLatitude),
        new BMap.Point(route.endLongitude, route.endLatitude));
      directionsService.setSearchCompleteCallback((results) => {
        if (directionsService.getStatus() === BMAP_STATUS_SUCCESS) {
          observer.next(results);
        }
      });
    });
  }

  public getRoute(route: H21MapRouteDirective): void {
    if (!this._initRoute) {
      this.geodesic = new Geodesic();
      this._initRoute = true;
    }
    this.getPatch(route).subscribe((LatLng) => {
      this.buildRoute(route, LatLng);
    });
  }

  public getInfo(route: H21MapRouteDirective, result: any, pach: any): void {
    const routeInfo = new RouteInfo();
    routeInfo.routeMode = route.routeMode;
    routeInfo.originPosition = this._getOriginPosition(route);
    if (result) {
      routeInfo.routePosition = this._getPointPosition(result);
    }

    setTimeout(() => {
      this._zone.run(() => this.routeReady.next(routeInfo));
    }, 200);
  }

  public removeRoute(route?: H21MapRouteDirective) {
    if (this.routes.get(route)) {
      this.map.api.removeOverlay(this.routes.get(route));
      this.routes.delete(route);
    }
  }

  public removeRoutes(): void {
    this.routes.forEach((key) => {
      this.map.api.removeOverlay(key);
    });
    this.routes.clear();
  }

  public fitBounds(route) {
    if (this.routes.get(route)) {
      this.map.api.setViewport(this.routes.get(route).getBounds());
    }
  }

  public createSymbol<E>(route: H21MapRouteDirective): E {
    let symbolIcons = this.createSymbolPatch(route);
    route.routeMode === RouteMode.transit || route.routeMode === RouteMode.walking ? symbolIcons = symbolIcons : symbolIcons = null;
    return <E><any>symbolIcons;
  }

  public createSymbolPatch(route: H21MapRouteDirective): google.maps.Symbol {
    let symbol = null;
    switch (route.routeMode) {
      case RouteMode.walking:
        symbol = this.walk.createSymbol(route);
        break;
      case RouteMode.transit:
        symbol = this.transit.createSymbol(route);
        break;
    }
    return symbol;
  }

  private _getPointPosition(results: any) {
    if (!results) {
      return;
    }
    const routePosition = new RoutePosition();
    routePosition.startPosition = new Position(results.getStart().lat,
      results.getStart().lng);
    routePosition.endPosition = new Position(results.getEnd().lat,
      results.getEnd().lng);
    return routePosition;
  }

  private _getOriginPosition(route: H21MapRouteDirective): any {
    const routeOriginPosition = new RoutePosition();
    routeOriginPosition.startPosition = new Position(route.startLatitude, route.startLongitude);
    routeOriginPosition.endPosition = new Position(route.endLatitude, route.endLongitude);
    return routeOriginPosition;
  }

}

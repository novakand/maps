import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';

// libs
import { Geodesic } from '@h21-map/yandex-geodesic';
import { Encoded } from '@h21-map/yandex-encoded';

// services
import { RouteService } from '../abstract/abstract-route';
import { YandexRouteFlyService } from './yandex-route-fly';
import { YandexRouteCarService } from './yandex-route-car';
import { YandexRouteTransitService } from './yandex-route-transit';
import { YandexRouteWalkService } from './yandex-route-walk';
import { YandexRouteRailsService } from './yandex-route-rail';

// enums
import { RouteMode } from '../../enums/route-type.enum';

// models
import { RouteInfo } from '../../models/route-info.model';
import { Position } from '../../models/position.model';
import { RoutePosition } from '../../models/route-position.models';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

@Injectable()
export class YandexRouteService extends RouteService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public encoded: any;
  public routes: Map<H21MapRouteDirective, ymaps.Polyline> = new Map<H21MapRouteDirective, ymaps.Polyline>();
  private _initRoute = false;

  constructor(
    public fly: YandexRouteFlyService,
    public railway: YandexRouteRailsService,
    public car: YandexRouteCarService,
    public transit: YandexRouteTransitService,
    public walk: YandexRouteWalkService,
    private _zone: NgZone,
  ) {
    super();
    this.car.initRoute(this);
    this.railway.initRoute(this);
    this.fly.initRoute(this);
    this.walk.initRoute(this);
    this.transit.initRoute(this);
  }

  public getPatch(route: H21MapRouteDirective): Observable<number[][]> {
    return new Observable((observer) => {
      switch (route.routeMode) {
        case RouteMode.walking:
          observer.next(this.walk.getPath(route));
          break;
        case RouteMode.fly:
          observer.next(this.fly.getPath(route));
          break;
        case RouteMode.car:
          this.car.getPath(route).subscribe((LatLng: number[][]) => {
            observer.next(LatLng);
          });
          break;
        case RouteMode.railway:
          break;
        case RouteMode.transit:
          observer.next(this.transit.getPath(route));
          break;
      }
    });
  }

  public getRoute(route: H21MapRouteDirective): void {
    if (!this._initRoute) {
      this.geodesic = new Geodesic();
      this._initRoute = true;
      this.encoded = new Encoded();
    }
    this.getPatch(route).subscribe((LatLng) => {
      this.buildRoute(route, LatLng);
    });
  }

  public buildRoute(route: H21MapRouteDirective, patch: number[][]): void {
    this.map.createPolyline(super.createRouteOptions(route)).subscribe((lRoute) => {
      this.routes.set(route, lRoute);
      this.addRoute(route, patch);
      if (route.routeFitBounds && patch.length > 0) {
        this.fitBounds();
      }
    });
  }

  public addRoute(route: H21MapRouteDirective, patch: number[][]) {
    this.map.api.geoObjects.add(this.routes.get(route));
    this.routes.get(route).geometry.setCoordinates(patch);
  }

  public removeRoute(route: H21MapRouteDirective): void {
    if (this.routes.get(route)) {
      this.map.api.geoObjects.remove(this.routes.get(route));
      this.routes.delete(route);
    }
  }

  public removeRoutes(): void {
    this.routes.forEach((key) => {
      this.map.api.geoObjects.remove(key);
    });
    this.routes.clear();
  }

  public fitBounds(): void {
    try {
    let bounds = [];
    this.routes.forEach((value) => {
      bounds = ymaps.util.bounds.fromPoints(value.geometry.getBounds());
    });
    this.map.api.setBounds(bounds);
  } catch { }
  }

  public createRoute(route: H21MapRouteDirective): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      ymaps.route([
        [route.startLatitude, route.startLongitude], [route.endLatitude, route.endLongitude],
      ], {
        routingMode: 'auto',
        multiRoute: false,
      },
      ).then((results: any) => {
        if (results) {
          observer.next(results);
        }

      });
    });
  }


  public getInfo(route: H21MapRouteDirective, result: any, pach: any): void {
    const routeInfo = new RouteInfo();
    routeInfo.routeMode = route.routeMode;
    routeInfo.originPosition = this._getOriginPosition(route);
    routeInfo.staticUrl = this._getStaticUrl(route, pach, result);
    if (result) {
      routeInfo.routePosition = this._getPointPosition(result);
    }
    this._zone.run(() => this.routeReady.next(routeInfo));
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

  private _getStaticUrl(route: H21MapRouteDirective, pach: [], result: any): string {
    const token = 'pk.eyJ1IjoiaG9yc2UyMSIsImEiOiJjazNoZHFpb2QwYWw3M2htdTE3ejlobWdyIn0.znyyDs4gHiWL6xGqZYePkA';
    let geodesic = false;
    const color = route.routeStrokeColor.replace('#', '');
    route.routeMode === RouteMode.fly ? geodesic = true : geodesic = false;
    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${''
      }path-${route.routeStrokeWeight}+${color}-0.9(${this._getEncodePathRoute(route, pach)}),${''
      }${this._getEncodePathMarkers(route, result)}/auto/400x400?access_token=${token}`;
  }

  private _getEncodePathRoute(route: H21MapRouteDirective, coords): string {
    return encodeURIComponent(this.encoded.encode(coords, null));
  }

  private _getEncodePathMarkers(route: H21MapRouteDirective, result: any): any {
    const markers = [];
    let start = `${route.startLatitude},${route.startLongitude}`;
    let end = `${route.endLatitude},${route.endLongitude}`;
    if (result) {
      start = `${result.responsePoints[0][1]},${result.responsePoints[0][0]}`;
      end = `${result.responsePoints[1][1]},${result.responsePoints[1][0]}`;
    }
    markers.push(`url-${encodeURIComponent(route.startIconStaticUrl)}(${start})`);
    markers.push(`url-${encodeURIComponent(route.endIconStaticUrl)}(${end})`);
    return markers.join(',');
  }

  private _getPointPosition(results: any) {
    if (!results) {
      return;
    }
    const routePosition = new RoutePosition();
    routePosition.startPosition = new Position(results.responsePoints[0][0],
      results.responsePoints[0][1]);
    routePosition.endPosition = new Position(results.responsePoints[1][0],
      results.responsePoints[1][1]);
    return routePosition;
  }

  private _getOriginPosition(route: H21MapRouteDirective): any {
    const routeOriginPosition = new RoutePosition();
    routeOriginPosition.startPosition = new Position(route.startLatitude, route.startLongitude);
    routeOriginPosition.endPosition = new Position(route.endLatitude, route.endLongitude);
    return routeOriginPosition;
  }

}

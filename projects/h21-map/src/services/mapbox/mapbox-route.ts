import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// libs
import { Geodesic } from '@h21-map/leaflet-geodesic';
import { Encoded } from '@h21-map/leaflet-encoded';
import { Observable, Observer } from 'rxjs';

// models
import { RouteInfo } from '../../models/route-info.model';
import { RoutePosition } from '../../models/route-position.models';
import { Position } from '../../models/position.model';

// enums
import { RouteMode } from '../../enums/route-type.enum';

// services
import { RouteService } from '../abstract/abstract-route';
import { MapboxRouteFlyService } from './mapbox-route-fly';
import { MapboxRouteRailsService } from './mapbox-route-rail';
import { MapboxRouteCarService } from './mapbox-route-car';
import { MapboxRouteTransitService } from './mapbox-route-transit';
import { MapboxRouteWalkService } from './mapbox-route-walk';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

@Injectable()

export class MapboxRouteService extends RouteService<L.Map, L.Marker, L.Polyline> {

  public geodesic: any;
  public encoded: any;
  public geodesicIsInit = false;
  public routes: Map<H21MapRouteDirective, L.Polyline> = new Map<H21MapRouteDirective, L.Polyline>();
  private _initRoute = false;

  constructor(
    public fly: MapboxRouteFlyService,
    public railway: MapboxRouteRailsService,
    public car: MapboxRouteCarService,
    public transit: MapboxRouteTransitService,
    public walk: MapboxRouteWalkService,
    private http: HttpClient,
    private _zone: NgZone,
  ) {
    super();
    this.car.initRoute(this);
    this.railway.initRoute(this);
    this.fly.initRoute(this);
    this.walk.initRoute(this);
    this.transit.initRoute(this);
  }

  public createRoute(route: H21MapRouteDirective): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http.get<any>(`https://api.mapbox.com/directions/v5/mapbox/driving/${''
        }${route.startLongitude},${route.startLatitude};${route.endLongitude},${route.endLatitude}${''
        }?geometries=geojson&steps=true&access_token=${this.map.apiConfig.key}`).subscribe((results) => {
          if (results && results.code === 'Ok') {
            observer.next(results);
          }
        }, (error) => {
          observer.error(null);
        });
    });
  }

  public getPatch(route: H21MapRouteDirective): Observable<L.LatLng[]> {
    return new Observable((observer) => {
      switch (route.routeMode) {
        case RouteMode.walking:
          observer.next(this.walk.getPath(route));
          break;
        case RouteMode.fly:
          observer.next(this.fly.getPath(route));
          break;
        case RouteMode.car:
          this.car.getPath(route).subscribe((LatLng: L.LatLng[]) => {
            observer.next(LatLng);
          });
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

  public fitBounds(): void {
    try {
      const bounds = L.latLngBounds([null, null], [null, null]);

      this.routes.forEach((value) => {
        bounds.extend(value.getBounds());
      });
      this.map.api.fitBounds(bounds.isValid() && bounds);
    } catch { }
  }

  public buildRoute(route: H21MapRouteDirective, patch: L.LatLng[]): void {
    this.map.createPolyline(super.createRouteOptions(route)).subscribe((lRoute) => {
      this.routes.set(route, lRoute);
      this.addRoute(route, patch);
      if (route.routeFitBounds && patch.length) {
        this.fitBounds();
      }
    });
  }

  public addRoute(route: H21MapRouteDirective, patch: L.LatLng[]) {
    if (this.routes.get(route)) {
      this.map.api.addLayer(this.routes.get(route));
      if (patch && patch.length) {
        this.routes.get(route).setLatLngs(patch);
      }
    }
  }

  public removeRoute(route: H21MapRouteDirective): void {
    if (this.routes.get(route)) {
      this.map.api.removeLayer(this.routes.get(route));
      this.routes.delete(route);
    }
  }

  public removeRoutes(): void {
    this.routes.forEach((key) => {
      this.map.api.removeLayer(key);
    });
    this.routes.clear();
  }

  public createSymbol<E>(route: H21MapRouteDirective): E {
    let symbolIcons = this.createSymbolPatch(route);
    route.routeMode === RouteMode.transit
      || route.routeMode === RouteMode.walking
      ? symbolIcons = symbolIcons : symbolIcons = null;
    return <E><any>symbolIcons;
  }

  public createSymbolPatch(route: H21MapRouteDirective): any {
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

  public getInfo(route: H21MapRouteDirective, result: any, pach: any): void {
    const routeInfo = new RouteInfo();
    routeInfo.routeMode = route.routeMode;
    routeInfo.staticUrl = this.getStaticUrl(route, pach, result);
    routeInfo.originPosition = this._getOriginPosition(route);
    if (result) {
      routeInfo.routePosition = this._getPointPosition(result);
    }

    setTimeout(() => {
      this._zone.run(() => this.routeReady.next(routeInfo));
    }, 50);
  }

  public getStaticUrl(route: H21MapRouteDirective, pach: [], result: any): string {
    let geodesic = false;
    const color = route.routeStrokeColor.replace('#', '');
    route.routeMode === RouteMode.fly ? geodesic = true : geodesic = false;
    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${''
      }path-${route.routeStrokeWeight}+${color}-0.9(${this._getEncodePathRoute(route, result)}),${''
      }${this._getEncodePathMarkers(route, result)}/auto/400x400?access_token=${this.map.apiConfig.key}`;
  }

  private _getEncodePathRoute(route: H21MapRouteDirective, result): string {
    const coords = [];
    for (const item of result.routes[0].geometry.coordinates) {
      coords.push([item[1], item[0]]);
    }
    return encodeURIComponent(this.encoded.encode(coords, null));
  }

  private _getEncodePathMarkers(route: H21MapRouteDirective, result: any): any {
    const markers = [];
    let start = `${route.startLatitude},${route.startLongitude}`;
    let end = `${route.endLatitude},${route.endLongitude}`;
    if (result) {
      start = `${result.waypoints[0].location[0]},${result.waypoints[0].location[1]}`;
      end = `${result.waypoints[1].location[0]},${result.waypoints[1].location[1]}`;
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
    routePosition.startPosition = new Position(results.waypoints[0].location[1],
      results.waypoints[0].location[0]);
    routePosition.endPosition = new Position(results.waypoints[1].location[1],
      results.waypoints[1].location[0]);
    return routePosition;
  }

  private _getOriginPosition(route: H21MapRouteDirective): any {
    const routeOriginPosition = new RoutePosition();
    routeOriginPosition.startPosition = new Position(route.startLatitude, route.startLongitude);
    routeOriginPosition.endPosition = new Position(route.endLatitude, route.endLongitude);
    return routeOriginPosition;
  }

}


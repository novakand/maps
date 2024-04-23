import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// enums
import { RouteMode } from '../../enums/route-type.enum';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// models
import { Position } from '../../models/position.model';
import { RouteInfo } from '../../models/route-info.model';
import { RoutePosition } from '../../models/route-position.models';
import { RouteValues } from '../../models/route-values.model';
import { WayPointsRoute } from '../../models/route-waypoints.model';
import { GoogleErrorMessages } from '../../enums/google/google-messages-error';

// services
import { RouteService } from '../abstract/abstract-route';
import { GoogleRouteFlyService } from './google-route-fly';
import { GoogleRouteRailsService } from './google-route-rail';
import { GoogleRouteCarService } from './google-route-car';
import { GoogleRouteTransitService } from './google-route-transit';
import { GoogleRouteWalkService } from './google-route-walk';

@Injectable()
export class GoogleRouteService extends RouteService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public routes: Map<H21MapRouteDirective, google.maps.Polyline> = new Map<H21MapRouteDirective, google.maps.Polyline>();

  constructor(
    public fly: GoogleRouteFlyService,
    public railway: GoogleRouteRailsService,
    public car: GoogleRouteCarService,
    public transit: GoogleRouteTransitService,
    public walk: GoogleRouteWalkService,
    private _zone: NgZone,
  ) {
    super();
    this.car.initRoute(this);
    this.railway.initRoute(this);
    this.fly.initRoute(this);
    this.walk.initRoute(this);
    this.transit.initRoute(this);
  }

  public getPatch(route: H21MapRouteDirective): Observable<google.maps.LatLng[]> {
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
        case RouteMode.railway:
          this.railway.getPath(route).subscribe((latLng) => {
            observer.next(latLng);
          });
          break;
        case RouteMode.transit:
          observer.next(this.transit.getPath(route));
          break;
      }
    });
  }

  public getRoute(route: H21MapRouteDirective): void {
    this.getPatch(route).subscribe((LatLng) => {
      this.buildRoute(route, LatLng);
    });
  }

  public createRoute(route: H21MapRouteDirective): Observable<google.maps.DirectionsResult> {
    let mode;
    let transitOpt: google.maps.TransitOptions;
    let drivingOpt: google.maps.DrivingOptions;
    const departureTime = new Date(Date.now() + 80000);

    switch (route.routeMode) {
      case RouteMode.car:
      case RouteMode.ferry:
        mode = google.maps.TravelMode.DRIVING;
        transitOpt = null;
        drivingOpt = {
          departureTime: departureTime,
          trafficModel: google.maps.TrafficModel.PESSIMISTIC,
        };
        break;
      case RouteMode.railway:
        mode = google.maps.TravelMode.TRANSIT;
        transitOpt = {
          routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS,
          departureTime: departureTime,
          modes: [google.maps.TransitMode.TRAIN],
        };
        drivingOpt = null;
        break;
    }

    return new Observable((observer: Observer<any>) => {
      const directionsService = new google.maps.DirectionsService();
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(route.startLatitude, route.startLongitude),
        destination: new google.maps.LatLng(route.endLatitude, route.endLongitude),
        travelMode: mode,
        transitOptions: transitOpt,
        provideRouteAlternatives: false,
        drivingOptions: drivingOpt,
      };
      directionsService.route(request, (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
        if (status === google.maps.DirectionsStatus.OK) {
          observer.next(result);
        } else {
          observer.next(null);
          this.map.mapErrorAPI.next(GoogleErrorMessages[status]);
          this.getInfo(route, null, null);
        }
      });

    });
  }

  public buildRoute(route: H21MapRouteDirective, patch: google.maps.LatLng[]): void {
    this.map.createPolyline(super.createRouteOptions(route)).subscribe((lRoute) => {
      if (!patch || !patch.length) {
        return;
      }
      this.routes.set(route, lRoute);
      this.addRoute(route, patch);
      if (route.routeFitBounds && patch.length) {
        this.fitBounds();
      }
    });
  }

  public addRoute(route: H21MapRouteDirective, patch: google.maps.LatLng[]): void {
    if (this.routes.get(route)) {
      this.routes.get(route).setMap(this.map.api);
      this.routes.get(route).setPath(patch);
    }
  }

  public removeRoute(route?: H21MapRouteDirective): void {
    return this._zone.run(() => {
      if (this.routes.get(route)) {
        this.routes.get(route).setMap(null);
        this.routes.delete(route);
      }
    });
  }

  public removeRoutes(): void {
    this.routes.forEach((key) => {
      return this._zone.run(() => {
        key.setMap(null);
      });
    });
    this.routes.clear();
  }

  public createSymbol<E>(route: H21MapRouteDirective): E {
    let symbolIcons = this.createSymbolIcons(this.createSymbolPatch(route), route);
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

  public createSymbolIcons(symbol: google.maps.Symbol, route?: H21MapRouteDirective): google.maps.IconSequence {
    let repeat = '10px';
    route.routeMode === RouteMode.transit ? repeat = '14px' : repeat = '10px';
    return {
      icon: symbol,
      offset: '0',
      repeat: repeat,
    };
  }

  public fitBounds() {
    try {
      const bounds = new google.maps.LatLngBounds();
      if (!this.routes.size) {
        return;
      }
      this.routes.forEach((value) => {
        value.getPath().forEach((latLng) => {
          bounds.extend(latLng);
        });
      });
      this.map.api.fitBounds(bounds);
    } catch { }
  }

  public getInfo(route: H21MapRouteDirective, result: any, pach: any): void {
    const routeInfo = new RouteInfo();
    routeInfo.routeMode = route.routeMode;
    routeInfo.originPosition = this._getOriginPosition(route);
    routeInfo.staticUrl = this._getStaticUrl(route, pach, result);
    if (result) {
      routeInfo.routePosition = this._getPointPosition(result);
      routeInfo.distance = this._getDistance(result);
      routeInfo.duration = this._getDuration(result);
      routeInfo.waypoints = this._getWayPointPosition(result, route);
    }

    setTimeout(() => {
      this._zone.run(() => this.routeReady.next(routeInfo));
    }, 50);
  }

  private _getStaticUrl(route: H21MapRouteDirective, pach: google.maps.LatLng[], result: google.maps.DirectionsResult): string {
    let geodesic = false;
    route.routeMode === RouteMode.fly ? geodesic = true : geodesic = false;
    const color = route.routeStrokeColor.replace('#', '');
    return `https://maps.googleapis.com/maps/api/staticmap?style=feature:all|saturation:-100&size=400x400&maptype=roadmap
        &path=geodesic:${ geodesic }|color:0x${ color }FF|weight:${ route.routeStrokeWeight }
        |enc:${ this._getEncodePathRoute(pach) || null }&${ this._getEncodePathMarkers(route, result) }
        &language=${ this.map.apiConfig.language }&key=${ this.map.apiConfig.key }`;
  }

  private _getPointPosition(results: google.maps.DirectionsResult) {
    if (!results) {
      return;
    }
    const itemRoute = results.routes[0].legs[0];
    const routePosition = new RoutePosition();
    routePosition.startPosition = new Position(itemRoute.start_location.lat(), itemRoute.start_location.lng());
    routePosition.startAddress = itemRoute.start_address;
    routePosition.endPosition = new Position(itemRoute.end_location.lat(), itemRoute.end_location.lng());
    routePosition.endAddress = itemRoute.end_address;
    return routePosition;
  }

  private _getOriginPosition(route: H21MapRouteDirective): any {
    const routeOriginPosition = new RoutePosition();
    routeOriginPosition.startPosition = new Position(route.startLatitude, route.startLongitude);
    routeOriginPosition.endPosition = new Position(route.endLatitude, route.endLongitude);
    return routeOriginPosition;
  }

  private _getEncodePathRoute(pach): any {
    if (!pach || pach.length === 0) {
      return;
    }
    if (!pach && pach.length === 0) {
      return;
    }
    const path = [];
    const every = this._getEveryRoute(pach.length);
    path.push(pach[0]);
    for (let i = 0; i < pach.length; i += every) {
      path.push(pach[i]);
    }
    path.push(pach[pach.length - 1]);
    return google.maps.geometry.encoding.encodePath(path);
  }

  private _getEveryRoute(length: number): number {
    let every = 5;
    const routePathLength = length;
    if (routePathLength > 500) {
      every = 10;
    }
    if (routePathLength > 1000) {
      every = 20;
    }
    if (routePathLength > 5000) {
      every = 40;
    }
    if (routePathLength > 10000) {
      every = 90;
    }
    return every;
  }

  private _getEncodePathMarkers(route: H21MapRouteDirective, result: google.maps.DirectionsResult): any {
    const markers = [];
    let start = `${ route.startLatitude },${ route.startLongitude }`;
    let end = `${ route.endLatitude },${ route.endLongitude }`;
    if (result) {
      start = `${ result.routes[0].legs[0].start_location.lat() },${ result.routes[0].legs[0].start_location.lng() }`;
      end = `${ result.routes[0].legs[0].end_location.lat() },${ result.routes[0].legs[0].end_location.lng() }`;
    }
    markers.push(`markers=anchor:-1,10|icon:${ route.startIconStaticUrl }|${ start }`);
    markers.push(`markers=anchor:-1,10|icon:${ route.endIconStaticUrl }|${ end }`);
    return markers.join('&');
  }

  private _getDistance(results) {
    if (!results) {
      return;
    }
    const itemRoute = results.routes[0].legs[0].distance;
    const distance = new RouteValues();
    distance.text = itemRoute.text;
    distance.value = itemRoute.value;
    return distance;
  }

  private _getDuration(results: google.maps.DirectionsResult) {
    if (!results) {
      return;
    }
    const itemRoute = results.routes[0].legs[0].duration;
    const duration = new RouteValues();
    duration.text = itemRoute.text;
    duration.value = itemRoute.value;
    return duration;
  }

  private _getWayPointPosition(results, route) {
    const wayPoints = [];
    if (!results) {
      return;
    }
    const w1: WayPointsRoute = {
      startPosition: new Position(results.request.origin.location.lat(), results.request.origin.location.lng()),
      endPosition: new Position(results.routes[0].legs[0].start_location.lat(), results.routes[0].legs[0].start_location.lng()),
      typeMode: RouteMode.walking,
    };

    const w2: WayPointsRoute = {
      startPosition: new Position(results.request.destination.location.lat(), results.request.destination.location.lng()),
      endPosition: new Position(results.routes[0].legs[0].end_location.lat(), results.routes[0].legs[0].end_location.lng()),
      typeMode: RouteMode.walking,
    };

    switch (route.routeMode) {
      case RouteMode.railway:
        const legs = results.routes[0].legs;
        for (const leg of legs) {
          const steps = leg.steps;
          for (const step of steps) {
            const transitMode = step.travel_mode;
            if (transitMode === google.maps.TravelMode.TRANSIT) {
              const vehicle = step.transit.line.vehicle.type;
              if (vehicle === 'HEAVY_RAIL' || vehicle === 'HIGH_SPEED_TRAIN') {
                let w3 = {};
                w3 = {
                  startPosition: new Position(step.start_location.lat(),
                    step.start_location.lng()),
                  startAddress: step.transit.departure_stop.name,
                  endPosition: new Position(step.end_location.lat(),
                    step.end_location.lng()),
                  endAddress: step.transit.arrival_stop.name,
                  typeMode: RouteMode.railway,
                };
                wayPoints.push(w3);
              }
            }
          }
        }
        break;
    }
    wayPoints.push(w1);
    wayPoints.push(w2);
    return wayPoints;

  }

}

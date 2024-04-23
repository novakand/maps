import { Injectable } from '@angular/core';

// external libs
import { Subject } from 'rxjs';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// enums
import { RouteMode } from '../../enums/route-type.enum';

// interfaces
import { IPolylineOptions } from '../../interfaces/polyline-options.interface';

// models
import { PolylineOptions } from '../../models/polyline-options.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class RouteService<T, U, N> {

  public map: MapService<T, U, N>;
  public routeReady: Subject<any> = new Subject<any>();
  public addRouteDirections: Subject<boolean> = new Subject<boolean>();
  public initRoute = false;
  public routeMode: RouteMode;
  public routes: Map<H21MapRouteDirective, N> = new Map<H21MapRouteDirective, N>();
  public geodesic: any;

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public getRoute(route: H21MapRouteDirective): void {
    this.getRoute(route);
  }

  public createRouteOptions(route: H21MapRouteDirective): IPolylineOptions {
    const polylineOptions = new PolylineOptions();
    polylineOptions.strokeColor = route.routeStrokeColor;
    polylineOptions.strokeOpacity = route.routeStrokeOpacity || 1;
    polylineOptions.strokeWeight = route.routeStrokeWeight || 2;
    polylineOptions.geodesic = route.routeMode === RouteMode.fly ? polylineOptions.geodesic = true : polylineOptions.geodesic = false;
    polylineOptions.symbol = this.createSymbol(route);
    return polylineOptions;
  }

  public abstract buildRoute(route: H21MapRouteDirective, patch: any, result: any): void;

  public abstract removeRoute(route?: H21MapRouteDirective): any;

  public abstract createSymbol(route: H21MapRouteDirective): any;

  public abstract removeRoutes(): void;

  public abstract fitBounds(route?: H21MapRouteDirective): void;


}

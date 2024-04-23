// external libs
import { Observable, Subject } from 'rxjs';

// components
import { H21MapDrawingManagerComponent } from '../../components';

// models
import { MarkerEvent } from '../../models/marker-event.model';
import { CircleEvent } from '../../models/circle-event.model';
import { AreaEvent } from '../../models/area-event.model';

// services
import { MapService } from './abstract-map';

export abstract class DrawingService<T, U, N> {

  public map: MapService<T, U, N>;
  public marker: MarkerEvent;
  public circle: CircleEvent;
  public area: AreaEvent;
  public drawingManager: any;

  public destroy$ = new Subject<boolean>();

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public abstract initDrawingManager(drawing: H21MapDrawingManagerComponent): void;

  public abstract addMarker(latitude: number, longitude: number): void;

  public abstract reset(): void;

  public abstract remove(): void;

  public abstract resetMarker(): void;

  public abstract isAnimateMarker(enabled: boolean): void;

  public abstract setMode(drawing: H21MapDrawingManagerComponent): void;

  public abstract createEvent<A>(eventName: string): Observable<A>;

  public destroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public createDrawingOptions(drawing: H21MapDrawingManagerComponent): any {
    const circleOptions = {
      strokeColor: drawing.strokeColor,
      fillColor: drawing.fillColor,
      strokeWeight: drawing.strokeWeight,
      strokeOpacity: drawing.strokeOpacity,
      fillOpacity: drawing.fillOpacity,
      maxRadius: drawing.circleMaxRadius,
      fitBounds: drawing.circleFitBounds,
      radius: drawing.circleRadius,
    };

    const areaOptions = {
      strokeColor: drawing.strokeColor,
      fillColor: drawing.fillColor,
      strokeWeight: drawing.strokeWeight,
      strokeOpacity: drawing.strokeOpacity,
      fillOpacity: drawing.fillOpacity,
      areaCoordinates: drawing.areaCoordinates,
      fitBounds: drawing.areaFitBounds,
      isMoreArea: drawing.isMoreArea,
      areaMaxSquare: drawing.areaMaxSquare,
      areaIconVertex: drawing.areaIconVertex,
    };

    const markerOptions = {
      iconUrl: drawing.markerIconUrl,
      isMarkerAnimate: drawing.isMarkerAnimate,
      iconUrlSelected: drawing.markerIconUrlSelected,
      wight: drawing.markerIconWidth,
      height: drawing.markerIconHeight,
      markerLatitude: drawing.markerLatitude,
      markerLongitude: drawing.markerLongitude,
      fitBounds: drawing.markerFitBounds,
    };

    return {
      activeMode: drawing.activeMode,
      isRedraw: drawing.isRedraw,
      isDraw: drawing.isDraw,
      drawingMode: drawing.drawingMode,
      markerOptions: markerOptions,
      circleOptions: circleOptions,
      areaOptions: areaOptions,
    };
  }

}


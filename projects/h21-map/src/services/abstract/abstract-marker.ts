import { Injectable } from '@angular/core';

// external libs
import { Observable, Subject } from 'rxjs';

// directives
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';

// interfaces
import { IImages } from '../../interfaces/icon.interface';
import { MarkerOptions } from '../../interfaces/marker-options.interface';

// models
import { Position } from '../../models/position.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class MarkerService<T, U, N> {

  public map: MapService<T, U, N>;
  public countLoadMarkers: Subject<number> = new Subject<number>();
  public markers: Map<H21MapMarkerDirective, U> = new Map<H21MapMarkerDirective, U>();

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public createMarkerOptions(marker: H21MapMarkerDirective): MarkerOptions {
    const icon: IImages = {
      width: marker.iconWidth,
      height: marker.iconHeight,
      url: marker.iconUrl,
    };

    const markerCreate = new MarkerOptions();
    markerCreate.position = new Position(marker.latitude, marker.longitude);
    markerCreate.icon = icon;
    markerCreate.labelClass = marker.labelClass;
    markerCreate.labelContent = marker.labelContent;
    markerCreate.zIndex = marker.iconZIndex;
    return markerCreate;
  }

  public getCountMarkers(): number {
    this.countLoadMarkers.next(this.markers.size);
    return this.markers.size;
  }

  public abstract addMarker(marker?: H21MapMarkerDirective): void;

  public abstract setIcon(marker: H21MapMarkerDirective): void;

  public abstract setZIndex(marker: H21MapMarkerDirective): void;

  public abstract setPosition(marker: H21MapMarkerDirective): void;

  public abstract setLabelContent(marker: H21MapMarkerDirective): void;

  public abstract setLabelClass(marker: H21MapMarkerDirective): void;

  public abstract setAnimation(marker: H21MapMarkerDirective): void;

  public abstract removeMarker(marker?: H21MapMarkerDirective): void;

  public abstract removeMarkers(): void;

  public abstract resetMarkers(): void;

  public abstract fitBounds(): void;

  public abstract createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E>;

  public abstract createEventMouseOver<D>(marker: H21MapMarkerDirective): Observable<D>;

  public abstract createEventMouseOut<D>(marker: H21MapMarkerDirective): Observable<D>;

  public abstract createEventMouseClick<DE>(marker: H21MapMarkerDirective): Observable<DE>;

}

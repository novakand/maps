import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';
import { H21MapClusterDirective } from '../../directives/h21-map-cluster.directive';

// directives
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class MarkerClusterService<T, U, N> {

  public map: MapService<T, U, N>;
  public markerCluster: any;

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public abstract initMarkerCluster(cluster: H21MapClusterDirective): void;

  public abstract addMarker(marker: H21MapMarkerDirective): void;

  public abstract removeMarker(marker: H21MapMarkerDirective): void;

  public abstract removeMarkers(): void;

  public abstract resetViewport(): void;

  public abstract setGridSize(cluster: H21MapClusterDirective): void;

  public abstract setMaxZoom(cluster: H21MapClusterDirective): void;

  public abstract setZoomOnClick(cluster: H21MapClusterDirective): void;

  public abstract setIconUrl(cluster: H21MapClusterDirective): void;

  public abstract setIconSize(cluster: H21MapClusterDirective): void;

  public abstract setMinimumClusterSize(cluster: H21MapClusterDirective): void;

  public abstract setAnimation(marker: H21MapMarkerDirective): void;

  public abstract createEvent<E>(eventName: string): Observable<E>;

  public abstract createEventMouseOver<D>(cluster: H21MapClusterDirective): Observable<D>;

  public abstract createEventMouseOut<D>(cluster: H21MapClusterDirective): Observable<D>;

}

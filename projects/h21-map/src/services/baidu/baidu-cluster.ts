import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// libs
import { MarkerCluster } from '@h21-map/baidu-markercluster';

// directives
import { H21MapClusterDirective } from '../../directives/h21-map-cluster.directive';
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';

// services
import { MarkerClusterService } from '../abstract/abstract-cluster';

declare var BMap;

@Injectable()
export class BaiduMarkerClusterService extends MarkerClusterService<BMap.Map, BMap.Marker, BMap.Polyline> {

  public markerCluster: any;

  constructor() {
    super();
  }

  public initMarkerCluster(cluster: H21MapClusterDirective): void {
    try {
      const options = [{
        url: cluster.iconUrl,
        size: new BMap.Size(cluster.width, cluster.height),
        textColor: cluster.textColor,
      }];

      this.markerCluster = new MarkerCluster(this.map.api);
      this.markerCluster.setStyles(options);
      this.markerCluster.setGridSize(cluster.gridSize);
      this.markerCluster.setMinClusterSize(cluster.minimumClusterSize);
    } catch (err) {
    }
  }

  public addMarker(marker: H21MapMarkerDirective): void {
    if (this.map.marker.markers.get(marker)) {
      this.markerCluster.addMarker(this.map.marker.markers.get(marker));
    }
  }

  public addMarkers(markers: H21MapMarkerDirective[]): void {
    this.markerCluster.addMarkers(markers);
  }

  public removeMarker(marker: H21MapMarkerDirective): void {
    if (this.map.marker.markers.get(marker)) {
      this.markerCluster.removeMarker(this.map.marker.markers.get(marker));
      this.map.marker.markers.delete(marker);
    }
  }

  public removeMarkers(): void {
    this.markerCluster.clearMarkers();
    this.map.marker.markers.clear();
  }

  public resetViewport(): void {
    this.markerCluster._redraw();
  }

  public setGridSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.setGridSize(cluster.gridSize);
  }

  public setMaxZoom(cluster: H21MapClusterDirective): void {
    this.markerCluster.setMaxZoom(cluster.maxZoom);
  }

  public setZoomOnClick(cluster: H21MapClusterDirective): void {
    throw new Error('Method not implemented.');
  }

  public setIconUrl(cluster: H21MapClusterDirective): void {
    const icon = [{
      url: cluster.iconUrl,
    }];
    this.markerCluster.setStyles(icon);
  }

  public setIconSize(cluster: H21MapClusterDirective): void {
    const size = [{
      size: new BMap.Size(cluster.width, cluster.height),
    }];
    this.markerCluster.setStyles(size);
  }

  public setMinimumClusterSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.setMinClusterSize(cluster.minimumClusterSize);
  }

  public setAnimation(marker: H21MapMarkerDirective): void {
  }

  public createEvent<E>(eventName: string): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      return null;
    });
  }

  public createEventMouseOver<D>(cluster: H21MapClusterDirective): Observable<D> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('clustermouseover').subscribe((event: any) => {
      });
    });
  }

  public createEventMouseOut<D>(cluster: H21MapClusterDirective): Observable<D> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('clustermouseout').subscribe((event: any) => {

      });
    });
  }

}

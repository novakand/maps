import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// libs
import { MarkerCluster } from '@h21-map/google-markercluster';

// directives
import { H21MapClusterDirective } from '../../directives/h21-map-cluster.directive';
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';

// services
import { MarkerClusterService } from '../abstract/abstract-cluster';

@Injectable()
export class GoogleMarkerClusterService extends MarkerClusterService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public markerCluster: any;

  constructor(private _zone: NgZone) {
    super();
  }

  public initMarkerCluster(cluster: H21MapClusterDirective): void {
    try {
      const icon = [
        {
          url: null,
          anchorText: [0, 0],
          averageCenter: true,
          height: cluster.height,
          width: cluster.width,
        }];

      const options = <any>{
        gridSize: cluster.gridSize || 200,
        minimumClusterSize: cluster.minimumClusterSize,
        maxZoom: cluster.maxZoom || 0,
        zoomOnClick: cluster.zoomOnClick || true,
        styles: icon || null,
      };
      this.markerCluster = new MarkerCluster(this.map.api, [], options);
    } catch {
    }
  }

  public addMarker(marker: H21MapMarkerDirective): void {
    if (this.map.marker.markers.get(marker)) {
      this.markerCluster.addMarker(this.map.marker.markers.get(marker));
    }
  }

  public removeMarker(marker: H21MapMarkerDirective): void {
    if (this.map.marker.markers.get(marker)) {
      this.markerCluster.removeMarker(this.map.marker.markers.get(marker), false);
      this.map.marker.markers.delete(marker);
    }
  }

  public removeMarkers() {
    try {
      this.markerCluster && this.markerCluster.clearMarkers();
    } catch {
    }
  }

  public resetViewport(): void {
    this.markerCluster.draw();
  }

  public setGridSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.setGridSize(cluster.gridSize);
  }

  public setMaxZoom(cluster: H21MapClusterDirective): void {
    this.markerCluster.setMaxZoom(cluster.maxZoom);
  }

  public setZoomOnClick(cluster: H21MapClusterDirective): void {
    this.markerCluster.setZoomOnClick(cluster.zoomOnClick);
  }

  public setIconUrl(cluster: H21MapClusterDirective): void {
    this.markerCluster.setImagePath(cluster.iconUrl);
  }

  public setIconSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.setImageSizes([cluster.width, cluster.height]);
  }

  public setMinimumClusterSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.setMinimumClusterSize(cluster.minimumClusterSize);
  }


  public setAnimation(marker: H21MapMarkerDirective): void {
    try {
      this.markerCluster.getClusters().forEach((key) => {
        key.clusterIcon_.eventDiv_.classList.remove('active');
        if (!key.clusterIcon_.visible_) { return; }
        const isCluster = key.isMarkerAlreadyAdded(this.map.marker.markers.get(marker));
        if (isCluster && marker.isLabelActive) {
          key.clusterIcon_.eventDiv_.classList.add('active');
        }
      });
    } catch  { }
  }

  public createEvent<E>(eventName: string): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      google.maps.event.addListener(this.markerCluster, eventName, (event: E) => this._zone.run(() => observer.next(event)));
    });
  }

  public createEventMouseOver<D>(cluster: H21MapClusterDirective): Observable<D> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseover').subscribe((event: any) => {
        event.clusterIcon_.eventDiv_.style.zIndex = cluster.iconHoverZIndex;
        this._zone.run(() => observer.next(null));
      });
    });
  }

  public createEventMouseOut<D>(cluster: H21MapClusterDirective): Observable<D> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseout').subscribe((event: any) => {
        event.clusterIcon_.eventDiv_.style.zIndex = cluster.iconZIndex;
        this._zone.run(() => observer.next(null));
      });
    });
  }

}

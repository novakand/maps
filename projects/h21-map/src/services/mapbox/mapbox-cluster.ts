import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// libs
import { MarkerCluster } from '@h21-map/leaflet-markercluster';

// services
import { MarkerClusterService } from '../abstract/abstract-cluster';

// directives
import { H21MapClusterDirective } from '../../directives/h21-map-cluster.directive';
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';

declare var L: any;

@Injectable()
export class MapboxMarkerClusterService extends MarkerClusterService<L.Map, L.Marker, L.Polyline> {

  public markerCluster: any;

  constructor(private _zone: NgZone) { super(); }

  public initMarkerCluster(cluster: H21MapClusterDirective) {
    try {
      if (!L.markerClusterGroup) {
        this.markerCluster = new MarkerCluster();
      }

      this.markerCluster = new L.markerClusterGroup(
        L.MarkerClusterGroupOptions = {
          chunkedLoading: true,
          disableClusteringAtZoom: null,
          maxZoom: cluster.maxZoom,
          spiderfyOnMaxZoom: false,
          maxClusterRadius: cluster.gridSize,
          showCoverageOnHover: false,
          removeOutsideVisibleBounds: true,
          iconCreateFunction: (clust) => {
            const markers = clust.getAllChildMarkers();
            const html = `<div class="cluster">${markers.length}</div><div class="cluster_icon"></div>`;
            return L.divIcon({ html: html, iconSize: L.point(cluster.width, cluster.height) });
          },
        });
      this.map.api.addLayer(this.markerCluster);
    } catch {
    }
  }

  public addMarker(marker: any): void {
    try {
      if (this.map.marker.markers.get(marker)) {
        (this.markerCluster || this.markerCluster.addLayer)
          && this.markerCluster.addLayer(this.map.marker.markers.get(marker));
      }
    } catch {
    }
  }

  public removeMarker(marker: H21MapMarkerDirective): void {
    try {
      if (this.map.marker.markers.get(marker)) {
        (this.markerCluster || this.markerCluster.clearLayers)
          && this.markerCluster.removeLayer(this.map.marker.markers.get(marker));
        this.map.marker.markers.delete(marker);
      }
    } catch {
    }
  }

  public removeMarkers(): void {
    try {
      (this.markerCluster || this.markerCluster.clearLayers) && this.markerCluster.clearLayers();
    } catch {
    }
  }

  public resetViewport(): void {
    this.markerCluster.refreshClusters();
  }

  public setGridSize(cluster: H21MapClusterDirective): void { }

  public setMaxZoom(cluster: H21MapClusterDirective): void {
    this.markerCluster.setMaxZoom(cluster.maxZoom);
  }

  public setZoomOnClick(cluster: H21MapClusterDirective): void {
    throw new Error('Method not implemented.');
  }

  public setIconUrl(cluster: H21MapClusterDirective): void {
    throw new Error('Method not implemented.');
  }

  public setIconSize(cluster: H21MapClusterDirective): void {
    throw new Error('Method not implemented.');
  }

  public setMinimumClusterSize(cluster: H21MapClusterDirective): void {
    throw new Error('Method not implemented.');
  }

  public setAnimation(marker: H21MapMarkerDirective): void {
    this.markerCluster._featureGroup.eachLayer((cluster) => {
      cluster._icon.lastChild.classList.remove('active');
    });
    const isCluster = this.markerCluster && this.markerCluster.getVisibleParent(this.map.marker.markers.get(marker));
    if (isCluster && marker.isLabelActive) {
      isCluster._icon.lastChild.classList.add('active');
    }

  }

  public createEvent<E>(eventName: string): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      this.markerCluster.on(eventName, (event: E) => this._zone.run(() => observer.next(event)));
    });
  }

  public createEventMouseOver<D>(cluster: H21MapClusterDirective): Observable<D> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('clustermouseover').subscribe((event: any) => {
        event.layer.options.icon._icon.style.zIndex = cluster.iconHoverZIndex;
        this._zone.run(() => observer.next(null));
      });
    });
  }

  public createEventMouseOut<D>(cluster: H21MapClusterDirective): Observable<D> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('clustermouseout').subscribe((event: any) => {
        event.layer.options.icon._icon.style.zIndex = cluster.iconZIndex;
        this._zone.run(() => observer.next(null));
      });
    });
  }

}

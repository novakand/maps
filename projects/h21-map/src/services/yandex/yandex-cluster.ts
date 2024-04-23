import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// services
import { MarkerClusterService } from '../abstract/abstract-cluster';

// directives
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';
import { H21MapClusterDirective } from '../../directives/h21-map-cluster.directive';

@Injectable()
export class YandexMarkerClusterService extends MarkerClusterService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public markerCluster: any;

  constructor() {
    super();
  }

  public initMarkerCluster(cluster: H21MapClusterDirective): void {
    const options = {
      clusterIconShape: {
        type: 'Circle',
        coordinates: [0, 0],
        radius: 25,
      },
      clusterIconLayout: ymaps.templateLayoutFactory.createClass(
        '<div class="cluster">{{ properties.geoObjects.length }}<div class="cluster_icon"></div></div>',
      ),
      clusterDisableClickZoom: !cluster.zoomOnClick,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false,
      minClusterSize: cluster.minimumClusterSize,
      maxZoom: cluster.maxZoom,
      zIndex: 1001,
      groupByCoordinates: false,
      gridSize: cluster.gridSize,
      hasBalloon: false,
    };

    this.markerCluster = new ymaps.Clusterer(options);
    this.map.api.geoObjects.add(this.markerCluster);

  }

  public addMarker(marker: H21MapMarkerDirective): void {
    if (this.map.marker.markers.get(marker)) {
      this.markerCluster.add(this.map.marker.markers.get(marker));
    }
  }

  public removeMarker(marker: H21MapMarkerDirective): void {
    if (this.map.marker.markers.get(marker)) {
      this.markerCluster.remove(this.map.marker.markers.get(marker));
      this.map.marker.markers.delete(marker);
      this.map.marker.getCountMarkers();
    }
  }

  public removeMarkers(): void {
    try {
    this.markerCluster.removeAll();
    this.map.marker.markers.clear();
  } catch {
  }
  }

  public setGridSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.options.set({
      gridSize: cluster.gridSize,
    });
  }

  public setMaxZoom(cluster: H21MapClusterDirective): void {
    this.markerCluster.options.set({
      maxZoom: cluster.maxZoom,
    });
  }

  public setZoomOnClick(cluster: H21MapClusterDirective): void {
    this.markerCluster.options.set({
      clusterDisableClickZoom: cluster.zoomOnClick,
    });
  }

  public setIconUrl(cluster: H21MapClusterDirective): void {
    const clusterIcons = [
      {
        href: cluster.iconUrl,
        size: [cluster.width, cluster.height],
      },
    ];
    this.markerCluster.options.set({
      clusterIcons: clusterIcons,
    });
  }

  public setIconSize(cluster: H21MapClusterDirective): void {
    const clusterIcons = [
      { size: [cluster.width, cluster.height], },
    ];
    this.markerCluster.options.set({
      clusterIcons: clusterIcons,
    });
  }

  public setMinimumClusterSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.options.set({
      minClusterSize: cluster.minimumClusterSize,
    });
  }

  public resetViewport(): void {
  }

  public setAnimation(marker: H21MapMarkerDirective): void {
    this.markerCluster.getClusters().forEach((key) => {
      if (!key._view._cluster.getOverlaySync()) { return; }
      key._view._cluster.getOverlaySync()._view._element.firstChild.childNodes[0].children[0].classList.remove('active');
    });
    const isCluster = this.markerCluster.getObjectState(this.map.marker.markers.get(marker));
    if (!isCluster.cluster || !isCluster.cluster._view.getOverlaySync()) { return; }
    if (isCluster.isClustered && marker.isLabelActive) {
      isCluster.cluster._view.getOverlaySync()._view._element.firstChild.childNodes[0].children[0].classList.add('active');
    }
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

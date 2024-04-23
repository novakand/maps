import { Injectable, NgZone } from '@angular/core';
// external libs
import { Observable, Observer } from 'rxjs';
// directives
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';
import { AnimateType } from '../../enums/animate.type';
// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';
// services
import { MarkerService } from '../abstract/abstract-marker';

@Injectable()
export class BaiduMarkerService extends MarkerService<BMap.Map, BMap.Marker, BMap.Polyline> {

  public markers: Map<H21MapMarkerDirective, BMap.Marker> = new Map<H21MapMarkerDirective, BMap.Marker>();

  constructor(private _zone: NgZone) {
    super();
  }

  public addMarker(marker: H21MapMarkerDirective): void {
    this.map.createMarker(this.createMarkerOptions(marker)).subscribe((baiduMarker) => {
      this.markers.set(marker, baiduMarker);
      marker.isCluster && this.map.cluster.markerCluster ?
        this.map.cluster.addMarker(marker) :
        this.map.api.addOverlay(this.markers.get(marker));
      this.setZIndex(marker);
    });

    if (this.map.fitBonds && marker.fitBounds) {
      this.fitBounds();
    }
    super.getCountMarkers();
  }

  public setAnimation(marker: H21MapMarkerDirective): void {
    const domElement = this.markers.get(marker).Ac.classList;
    for (const item of domElement) {
      domElement.remove(AnimateType[item]);
    }
    marker.animate && this.markers.get(marker).Ac.classList.add(AnimateType[marker.animate]);

  }

  public setIcon(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      const icon = new BMap.Icon(marker.iconUrl, new BMap.Size(marker.iconWidth, marker.iconHeight));
      this.markers.get(marker).setIcon(icon);
    }
  }

  public setZIndex(marker: H21MapMarkerDirective): void {
    this.markers.get(marker) && this.markers.get(marker).setZIndex(marker.iconZIndex);
    this.markers.get(marker) && this.markers.get(marker).draw();

  }

  public setPosition(marker: H21MapMarkerDirective): void {
    this.markers.get(marker).setPosition(new BMap.Point(marker.longitude, marker.latitude));
  }

  public setLabelContent(marker: H21MapMarkerDirective): void {
  }

  public setLabelClass(marker: H21MapMarkerDirective): void {
  }

  public removeMarker(marker: H21MapMarkerDirective): void {
    return this._zone.run(() => {
      if (marker.isCluster) {
        this.map.cluster.removeMarker(marker);
      } else {
        if (this.markers.get(marker)) {
          this.map.api.removeOverlay(this.markers.get(marker));
          this.markers.delete(marker);
        }
      }
      super.getCountMarkers();
    });
  }

  public removeMarkers(): void {
    this.markers.forEach((key) => {
      this.map.api.removeOverlay(key);
    });
    this.markers.clear();
  }

  public resetMarkers(): void { }

  public createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      this.markers.get(marker).addEventListener(eventName, (event: E) => this._zone.run(() => observer.next(event)));
    });
  }

  public createEventMouseOver<A>(marker: H21MapMarkerDirective): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseover', marker).subscribe((event: IEventMouse) => {
        this._zone.run(() => observer.next(this.map.conversions.translateLatLngClientXY(event)));
      });
    });
  }

  public createEventMouseOut<A>(marker: H21MapMarkerDirective): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseout', marker).subscribe((event: IEventMouse) => {
        this._zone.run(() => observer.next(null));
      });
    });
  }

  public createEventMouseClick<A>(marker: H21MapMarkerDirective): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('click', marker).subscribe((event: IEventMouse) => {
        this._zone.run(() => observer.next(this.map.conversions.translateClientXY(event)));
      });
    });
  }

  public setAncor(marker: H21MapMarkerDirective): void {
  }

  public fitBounds(): void {
    const bounds = this.map.api.getBounds();
    this.markers.forEach((value) => {
      bounds.extend(value.getPosition());
    });
    this.markers.size > 1 ?
      this.map.api.setViewport(bounds) :
      this._fitBoundsOne();
  }

  private _fitBoundsOne() {
    this.map.api.setCenter(this.markers.values().next().value.getPosition());
    this.map.api.setZoom(10);
  }

}

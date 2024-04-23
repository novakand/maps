
import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// services
import { MarkerService } from '../abstract/abstract-marker';

// enums
import { AnimateType } from '../../enums/animate.type';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// directives
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';

@Injectable()
export class GoogleMarkerService extends MarkerService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public markers: Map<H21MapMarkerDirective, google.maps.Marker> = new Map<H21MapMarkerDirective, google.maps.Marker>();

  constructor(private _zone: NgZone) {
    super();
  }

  public addMarker(marker: H21MapMarkerDirective): void {
    this.map.createMarker(this.createMarkerOptions(marker)).subscribe((gMarker) => {
      this.markers.set(marker, gMarker);
      marker.isCluster && this.map.cluster.markerCluster ?
        this.map.cluster.addMarker(marker) :
        this.markers.get(marker).setMap(this.map.api);
    });

    this.map.fitBonds && marker.fitBounds && this.fitBounds();
  }

  public setIcon(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      const icon = {
        url: marker.iconUrl,
        anchor: new google.maps.Point(12, 31),
        size: new google.maps.Size(marker.iconWidth, marker.iconHeight),
      };
      this.markers.get(marker).setIcon(icon);
    }
  }

  public setPosition(marker: H21MapMarkerDirective): void {
    this.markers.get(marker) && this.markers.get(marker).setPosition(new google.maps.LatLng(marker.latitude, marker.longitude));
  }

  public setAnimation(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      this.markers.get(marker).labelClass = AnimateType[marker.animate] || 'not';
      this.markers.get(marker).label.setStyles();
    }
  }

  public setZIndex(marker: H21MapMarkerDirective): void {
    this.markers.get(marker) && this.markers.get(marker).setZIndex(marker.iconZIndex);
  }

  public setLabelContent(marker: H21MapMarkerDirective): void {
    this.markers.get(marker).labelContent = marker.labelContent;
    this.markers.get(marker).label.setContent();
  }

  public setLabelClass(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      marker.isCluster && this.map.cluster.setAnimation(marker);
      if (!this.markers.get(marker).labelClass) { return; }
      this.markers.get(marker).labelClass = marker.isLabelActive
        ? marker.labelActiveClass : marker.labelClass;
      this.markers.get(marker).label.setStyles();
    }
  }

  public removeMarker(marker: H21MapMarkerDirective): void {
    if (marker.isCluster) {
      this.map.cluster.removeMarker(marker);
    } else {
      if (this.markers.get(marker)) {
        this.markers.get(marker).setMap(null);
        this.markers.delete(marker);
      }
    }
  }

  public removeMarkers(): void {
    this.markers.forEach((key) => {
      key.setMap(null);
    });
    this.markers.clear();
  }

  public createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      this.markers.get(marker).addListener(eventName, (event: E) => this._zone.run(() => observer.next(event)));
    });
  }

  public createEventMouseOver<A>(marker: H21MapMarkerDirective): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseover', marker).subscribe((event: IEventMouse) => {
        event.latLng = this.markers.get(marker).getPosition();
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
        event.latLng = this.markers.get(marker).getPosition();
        this._zone.run(() => observer.next(this.map.conversions.translateLatLngClientXY(event)));
      });
    });
  }

  public resetMarkers(): void {
    this.map.marker.markers.forEach((key) => {
      if (key.labelContent && key.label.labelDiv_.classList.contains('active')) {
        key.labelClass = key.label.labelDiv_.classList[0];
        key.label.setStyles();
      }
    });
  }

  public fitBounds(): void {
    try {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((value) => {
        bounds.extend(value.getPosition());
      });

      this.markers.size > 1 ?
        this.map.api.fitBounds(bounds) :
        this._fitBoundsOne();
    } catch {
    }
  }

  private _fitBoundsOne(): void {
    try {
      this.map.api.panTo(this.markers.values().next().value.getPosition());
      this.map.setZoom(13);
    } catch {
    }
  }

}

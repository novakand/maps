import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// enums
import { AnimateType } from '../../enums/animate.type';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// services
import { MarkerService } from '../abstract/abstract-marker';

// directives
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';

@Injectable()
export class MapboxMarkerService extends MarkerService<L.Map, L.Marker, L.Polyline> {

  public markers: Map<H21MapMarkerDirective, L.Marker> = new Map<H21MapMarkerDirective, L.Marker>();

  constructor(private _zone: NgZone) {
    super();
  }

  public addMarker(marker: H21MapMarkerDirective): void {
    this.map.createMarker(this.createMarkerOptions(marker)).subscribe((lMarker) => {
      this.markers.set(marker, lMarker);
      marker.isCluster && this.map.cluster.markerCluster ?
        this.map.cluster.addMarker(marker) :
        this.map.api && this.map.api.addLayer(this.markers.get(marker));
    });

    this.map.fitBonds && marker.fitBounds && this.fitBounds();

    super.getCountMarkers();
  }

  public setAnimation(marker: H21MapMarkerDirective): void {
    try {
      if (!this.markers.get(marker)._icon) {
        return;
      }
      const domElement = this.markers.get(marker)._icon.classList;
      for (const item of domElement) {
        domElement.remove(AnimateType[item]);
      }

      marker.animate && domElement.add(AnimateType[marker.animate]);
    } catch { }
  }

  public setIcon(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      const icon = L.divIcon({
        iconSize: new L.Point(marker.iconWidth, marker.iconHeight),
        iconAnchor: [12, 31],
        className: 'leaflet-div-icon',
        html: `<img src='${marker.iconUrl}'/>`,
      });

      this.markers.get(marker).setIcon(icon);
    }
  }

  public setZIndex(marker: H21MapMarkerDirective): void {
    this.markers.get(marker) && this.markers.get(marker).setZIndexOffset(marker.iconZIndex);
  }

  public setPosition(marker: H21MapMarkerDirective): void {
    this.markers.get(marker).setLatLng([marker.latitude, marker.longitude]);
  }

  public removeMarker(marker: H21MapMarkerDirective): void {
    if (marker.isCluster) {
      this.map.cluster.removeMarker(marker);
    } else {
      if (this.markers.get(marker)) {
        this.map.api.removeLayer(this.markers.get(marker));
        this.markers.delete(marker);
      }
    }
  }

  public setLabelContent(marker: H21MapMarkerDirective): void {
    this.markers.get(marker).getElement().innerText = marker.labelContent;
  }

  public setLabelClass(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      marker.isCluster && this.map.cluster.setAnimation(marker);
      if (!this.markers.get(marker).getElement()
        || !this.markers.get(marker).getElement().className) { return; }
      this.markers.get(marker).getElement().className = marker.isLabelActive
        ? marker.labelActiveClass : marker.labelClass;
    }
  }

  public removeMarkers(): void {
    this.markers.forEach((key) => {
      this.map.api.removeLayer(key);
    });
    this.markers.clear();
  }

  public resetMarkers(): void { }

  public createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E> {
    return new Observable((observer: Observer<any>) => {
      this.markers.get(marker).addEventListener(eventName, (event) => {
        this._zone.run(() => observer.next(event));
      });
    });
  }

  public createEventMouseOver<A>(marker: H21MapMarkerDirective): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseover', marker).subscribe((event: IEventMouse) => {
        marker.labelContent && this._eventPositionLabel(event, marker);
        this._zone.run(() => observer.next(this.map.conversions.translateLatLngClientXY(event)));
        this.map.api.dragging.disable();
      });
    });
  }

  public createEventMouseOut<A>(marker: H21MapMarkerDirective): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseout', marker).subscribe((event: IEventMouse) => {
        this._zone.run(() => observer.next(null));
        this._zone.run(() => this.map.api.dragging.enable());
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

  public fitBounds(): void {
    try {
      const bounds = L.latLngBounds([null, null], [null, null]);
      this.markers.forEach((value) => {
        bounds.extend(value.getLatLng());
      });
      this.markers.size > 1 ?
        this.map.api.fitBounds(bounds.isValid() && bounds) :
        this._fitBoundsOne();
    } catch {
    }
  }

  private _fitBoundsOne() {
    try {
      this.map.api.setView(this.markers.values().next().value.getLatLng(), 13);
    } catch {
    }
  }

  private _eventPositionLabel(event: IEventMouse, marker: H21MapMarkerDirective) {
    const size = this.markers.get(marker).getElement();
    event.offsetX = size.offsetWidth / 2 - 60;
    event.offsetY = size.offsetHeight;
    return event;
  }

}

import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// enums
import { DocumentAttributes } from '../../enums/document.attributes.type';
import { AnimateType } from '../../enums/animate.type';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// services
import { MarkerService } from '../abstract/abstract-marker';

// directives
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';

@Injectable()
export class YandexMarkerService extends MarkerService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public markers: Map<H21MapMarkerDirective, ymaps.GeoObject> = new Map<H21MapMarkerDirective, ymaps.GeoObject>();

  constructor(private _zone: NgZone) {
    super();
  }

  public addMarker(marker: H21MapMarkerDirective): void {
    this.map.createMarker(this.createMarkerOptions(marker)).subscribe((yMarker) => {
      this.markers.set(marker, yMarker);
      marker.isCluster && this.map.cluster.markerCluster ?
        this.map.cluster.addMarker(marker) :
        this.map.api.geoObjects.add(this.markers.get(marker));
    });

    if (this.map.fitBonds && marker.fitBounds) {
      this.fitBounds();
    }

  }

  public setIcon(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      this.markers.get(marker).options.set({
        iconImageOffset: [-7, -10],
        iconImageHref: marker.iconUrl,
        iconImageSize: [marker.iconWidth, marker.iconHeight],
      });
    }
  }

  public setAnimation(marker: H21MapMarkerDirective): void {
    try {
      if (!this.markers.get(marker).getOverlaySync()) {
        return;
      }
      const domElement = this.markers.get(marker).getOverlaySync().getLayoutSync().getElement().classList;
      for (const item of domElement) {
        domElement.remove(AnimateType[item]);
      }
      if (!marker.animate) {
        return;
      }
      domElement.add(AnimateType[marker.animate] || 'not');
    } catch { }
  }

  public setZIndex(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      this.markers.get(marker).options.set({
        zIndex: marker.iconZIndex,
        zIndexHover: marker.iconZIndex,
      });
    }
  }

  public setPosition(marker: H21MapMarkerDirective): void {
    this.markers.get(marker).geometry.setCoordinates([marker.latitude, marker.longitude]);
  }

  public removeMarker(marker: H21MapMarkerDirective): void {
    if (marker.isCluster) {
      this.map.cluster.removeMarker(marker);
    } else {
      if (this.markers.get(marker)) {
        this.map.api.geoObjects.remove(this.markers.get(marker));
        this.markers.delete(marker);
      }
    }
  }

  public resetMarkers(): void { }

  public setLabelContent(marker: H21MapMarkerDirective): void {
    const element = this.markers.get(marker).getOverlaySync().getLayoutSync().getElement();
    element.getElementsByClassName('h21-map-price-marker')[0][DocumentAttributes.innerHTML] = marker.labelContent;
  }

  public setLabelClass(marker: H21MapMarkerDirective): void {
    if (this.markers.get(marker)) {
      marker.isCluster && this.map.cluster.setAnimation(marker);
      if (!this.markers.get(marker).getOverlaySync()
        || !marker.labelContent
        || !this.markers.get(marker).getOverlaySync().getLayoutSync().getElement()) { return; }
      this.markers.get(marker).getOverlaySync().getLayoutSync().getElement().getElementsByClassName(marker.labelClass)[0].className = marker.isLabelActive
        ? marker.labelActiveClass : marker.labelClass;
    }
  }

  public removeMarkers(): void {
    this.markers.forEach((key) => {
      this.map.api.geoObjects.remove(key);
    });
    this.markers.clear();
  }

  public createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E> {
    return new Observable((observer: Observer<any>) => {
      this.markers.get(marker).events.add(eventName, (event) => this._zone.run(() => observer.next(event)));
    });

  }

  public createEventMouseOver<A>(marker: H21MapMarkerDirective): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseenter', marker).subscribe((event: IEventMouse) => {
        this._eventPositionLabel(event, marker);
        this.map.api.behaviors.get('drag').disable();
        this._zone.run(() => observer.next(this.map.conversions.translateLatLngClientXY(event)));
      });
    });
  }

  public createEventMouseOut<A>(marker: H21MapMarkerDirective): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('mouseleave', marker).subscribe((event: IEventMouse) => {
        this._zone.run(() => observer.next(null));
        this.map.api.behaviors.get('drag').enable();
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
    let bounds = [];
    this.markers.forEach((value) => {
      bounds = ymaps.util.bounds.fromPoints(value.geometry.getBounds());
    });
    this.markers.size > 1 ?
      this.map.api.setBounds(bounds) :
      this._fitBoundsOne();

  }

  private _fitBoundsOne() {
    this.map.api.setCenter(this.markers.values().next().value.geometry.getCoordinates());
    this.map.api.setZoom(13);
  }

  private _eventPositionLabel(event: IEventMouse, marker: H21MapMarkerDirective) {
    marker.labelContent ? event.offsetX = 0 : event.offsetX = 5;
    marker.labelContent ? event.offsetY = 10 : event.offsetY = 15;
    return event;
  }

}

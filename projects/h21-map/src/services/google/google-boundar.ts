import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// directives
import { H21MapBoundarDirective } from '../../directives/h21-map-boundar.directive';

// services
import { BoundarService } from '../abstract/abstract-boundar';

@Injectable()
export class GoogleBoundarService extends BoundarService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public feature: Map<H21MapBoundarDirective, google.maps.Data.Feature[]> = new Map<H21MapBoundarDirective, google.maps.Data.Feature[]>();

  public addBoundar(boundar: H21MapBoundarDirective): void {
    this.setStyle(boundar);
    this.map.boundar.getBoundar(boundar.regionName).subscribe((gboundar) => {
      if (gboundar) {
        const feature = this.map.api.data.addGeoJson(gboundar);
        if (feature.length) {
          feature[0].setProperty('id', boundar.id);
          this.feature.set(boundar, feature);
        }
      }
      if (this.map.fitBonds && boundar.fitBounds) {
        this.fitBounds(boundar);
      }
    });
  }

  public setStyle(boundar: H21MapBoundarDirective): void {
    const options = {
      fillColor: boundar.fillColor,
      fillOpacity: boundar.fillOpacity,
      strokeColor: boundar.strokeColor,
      strokeOpacity: boundar.strokeOpacity,
      strokeWeight: boundar.strokeWeight,
      id: 0,
    };
    this.map.api.data.setStyle(options);
  }

  public loadBoundar(url: string, boundar: H21MapBoundarDirective): void {
    this.map.api.data.loadGeoJson(url);
  }

  public removeBoundar(boundar: H21MapBoundarDirective) {
    if (this.feature.get(boundar)) {
      this.map.api.data.remove(this.feature.get(boundar)[0]);
    }
  }

  public fitBounds(boundar): void {
    const bounds = new google.maps.LatLngBounds();
    if (this.feature.get(boundar)) {
      this.feature.get(boundar)[0].getGeometry().forEachLatLng((latLng) => {
        bounds.extend(latLng);
      });
    }
    this.map.api.fitBounds(bounds);
    this._getGeometry(boundar);

  }

  public createEvent<E>(eventName: string, boundar: H21MapBoundarDirective): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      this.map.api.data.addListener(eventName, (event: E) => observer.next(event));
    });
  }

  private _getGeometry(boundar: H21MapBoundarDirective) {
    const geometry = [];
    if (this.feature.get(boundar)) {
      this.feature.get(boundar)[0].getGeometry().forEachLatLng((latLng) => {
        geometry.push(latLng);
      });
      this.addBoundar$.next(this.map.conversions.translateRoutePosition(geometry, true));
    }
  }

}

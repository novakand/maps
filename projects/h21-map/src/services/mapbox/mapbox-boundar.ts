import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// services
import { BoundarService } from '../abstract/abstract-boundar';

// directives
import { H21MapBoundarDirective } from '../../directives/h21-map-boundar.directive';

@Injectable()
export class MapboxBoundarService extends BoundarService<L.Map, L.Marker, L.Polyline> {

  public feature: Map<H21MapBoundarDirective, L.GeoJSON> = new Map<H21MapBoundarDirective, L.GeoJSON>();

  public removeBoundar(boundar: H21MapBoundarDirective): void {
    if (this.feature.get(boundar)) {
      this.map.api.removeLayer(this.feature.get(boundar));
    }
  }

  public addBoundar(boundar: H21MapBoundarDirective): void {
    this.map.boundar.getBoundar(boundar.regionName).subscribe((Lboundar) => {
      if (Lboundar) {
        const feature = L.geoJSON(Lboundar);
        this.map.api.addLayer(feature);
        this.feature.set(boundar, feature);
        this.setStyle(boundar);
      }
      if (this.map.fitBonds && boundar.fitBounds) {
        this.fitBounds(boundar);
      }
    });
  }

  public setStyle(boundar: H21MapBoundarDirective): void {
    const options = {
      color: boundar.fillColor,
      fillOpacity: boundar.fillOpacity,
      weight: boundar.strokeWeight,
    };
    if (this.feature.get(boundar)) {
      this.feature.get(boundar).setStyle(options);
    }
  }

  public loadBoundar(url: string, boundar: H21MapBoundarDirective): void {
  }

  public fitBounds(boundar: H21MapBoundarDirective): void {
    this.map.api.fitBounds(this.feature.get(boundar).getBounds());
    this._getGeometry(boundar);
  }

  public createEvent<E>(eventName: string, boundar: H21MapBoundarDirective): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      if (this.feature.get(boundar)) {
        this.feature.get(boundar).addEventListener(eventName, (event: any) => observer.next(event));
      }
    });
  }

  private _getGeometry(boundar: H21MapBoundarDirective) {
    if (this.feature.get(boundar)) {
      this.addBoundar$.next(null);
    }
  }

}

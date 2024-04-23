import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// services
import { BoundarService } from '../abstract/abstract-boundar';

// directives
import { H21MapBoundarDirective } from '../../directives/h21-map-boundar.directive';

@Injectable()
export class YandexBoundarService extends BoundarService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public setStyle(boundar: H21MapBoundarDirective): void { }

  public removeBoundar(boundar: H21MapBoundarDirective): void { }

  public createEvent<E>(eventName: string): Observable<E> {
    return;
  }

  public addBoundar(boundar: H21MapBoundarDirective): void {
    this.map.boundar.getBoundar(boundar.regionName).subscribe((Yboundar) => { });
  }

  public fitBounds(boundar: H21MapBoundarDirective): void { }

  public loadBoundar(url: string, boundar: H21MapBoundarDirective): void { }

}

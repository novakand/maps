import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// directives
import { H21MapBoundarDirective } from '../../directives/h21-map-boundar.directive';

// services
import { BoundarService } from '../abstract/abstract-boundar';

@Injectable()
export class BaiduBoundarService extends BoundarService<BMap.Map, BMap.Marker, BMap.Polyline> {

  public setStyle(boundar: H21MapBoundarDirective): void { }

  public removeBoundar(boundar: H21MapBoundarDirective): void { }

  public createEvent<E>(eventName: string): Observable<E> {
    return;
  }

  public addBoundar(boundar: H21MapBoundarDirective): void {
    this.map.boundar.getBoundar(boundar.regionName).subscribe((Yboundar) => {
    });
  }

  public loadBoundar(url: string, boundar: H21MapBoundarDirective): void { }

}

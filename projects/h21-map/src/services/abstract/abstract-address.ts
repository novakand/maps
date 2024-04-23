import { Injectable } from '@angular/core';

// interfaces
import { IInitMap } from '../../interfaces/init-map.interface';

// models
import { PointAddress } from '../../models/point-address.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class AddressService<T, U, N> implements IInitMap<T, U, N> {

  public map: MapService<T, U, N>;

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public abstract getDetailsAddress(place: any): PointAddress;

}

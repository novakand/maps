import { Injectable } from '@angular/core';

// models
import { PointAddress } from '../../models/point-address.model';

// services
import { AddressService } from '../abstract/abstract-address';

@Injectable()
export class BaiduAddressService extends AddressService<BMap.Map, BMap.Marker, BMap.Polyline> {

  public getDetailsAddress(place: any): PointAddress {
    return null;
  }

}

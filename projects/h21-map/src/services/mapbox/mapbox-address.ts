import { Injectable } from '@angular/core';

// enums
import { MapboxAddressType } from '../../enums/mapbox/mapbox-address-type.enum';

// models
import { PointAddress } from '../../models/point-address.model';

// services
import { AddressService } from '../abstract/abstract-address';

@Injectable()
export class MapboxAddressService extends AddressService<L.Map, L.Marker, L.Polyline> {

  public getDetailsAddress(place: any): PointAddress {
    let country = null;
    const components = place.context;
    if (!components) {
      return country = place.text;
    }
    country = this._getLong(components, MapboxAddressType.country) || place.place_type[0] || '';
    const region = this._getLong(components, MapboxAddressType.region) || '';
    const city = this._getLong(components, MapboxAddressType.place)
      || this._getLong(components, MapboxAddressType.region)
      || place.properties.short_code
      || '';
    const district = this._getLong(components, MapboxAddressType.locality) || region || '';
    const postCode = this._getLong(components, MapboxAddressType.postcode) || '';
    const countryCode = this._getShort(components, MapboxAddressType.country).toUpperCase() || '';
    return { country, city, district, countryCode, postCode };
  }

  private _getComponent(components: any, name: string) {
    return components.filter((component) => component.id.split('.')[0] === name)[0];
  }

  private _getLong(components: any, name: string) {
    const component = this._getComponent(components, name);
    return component && component.text || '';
  }

  private _getShort(components: any, name: string) {
    const component = this._getComponent(components, name);
    return component && component.short_code || '';
  }

}

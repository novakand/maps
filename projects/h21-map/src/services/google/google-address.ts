import { Injectable } from '@angular/core';

// enums
import { GoogleAddressType } from '../../enums/google/google-address-type.enum';

// services
import { AddressService } from '../abstract/abstract-address';

type Components = google.maps.GeocoderAddressComponent[];

@Injectable()
export class GoogleAddressService extends AddressService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public getDetailsAddress(place: any): any {
    const components = place.address_components;
    if (!components) {
      return;
    }

    const areaLevel1 = this._getShort(components, GoogleAddressType.administrativeAreaLevel1) || '';
    const areaLevel2 = this._getShort(components, GoogleAddressType.administrativeAreaLevel2) || '';
    const areaLevel3 = this._getShort(components, GoogleAddressType.administrativeAreaLevel3) || '';
    const locality2 = this._getLong(components, GoogleAddressType.postalTown) || '';
    const locality = this._getLong(components, GoogleAddressType.locality) || '';
    const country = this._getLong(components, GoogleAddressType.country) || '';
    const countryCode = this._getShort(components, GoogleAddressType.country) || '';
    const city = locality || areaLevel3 || locality2 || '';
    const district = areaLevel1 || areaLevel2 || '';
    const street = this._getLong(components, GoogleAddressType.route) || '';
    const house = this._getLong(components, GoogleAddressType.streetNumber) || '';
    const postalCode = this._getLong(components, GoogleAddressType.postalCode) || '';

    return { country, city, district, street, house, postalCode, countryCode };
  }

  private _getComponent(components: Components, name: string) {
    return components.filter((component) => component.types[0] === name)[0];
  }

  private _getLong(components: Components, name: string) {
    const component = this._getComponent(components, name);
    return component && component.long_name || '';
  }

  private _getShort(components: Components, name: string) {
    const component = this._getComponent(components, name);
    return component && component.short_name || '';
  }

}

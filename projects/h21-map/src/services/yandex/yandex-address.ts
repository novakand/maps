import { Injectable } from '@angular/core';

// enums
import { YandexAddressType } from '../../enums/yandex/yandex-address-type.enum';

// models
import { PointAddress } from '../../models/point-address.model';

// services
import { AddressService } from '../abstract/abstract-address';

@Injectable()
export class YandexAddressService extends AddressService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public getDetailsAddress(place: any): PointAddress {
    try {
      const components = place.properties._data.metaDataProperty.GeocoderMetaData.Address.Components;
      if (!components) {
        return null;
      }
      const country = this._getKind(components, YandexAddressType.country) || '';
      const locality = this._getKind(components, YandexAddressType.locality) || '';
      const street = this._getKind(components, YandexAddressType.street) || '';
      const house = this._getKind(components, YandexAddressType.house) || '';
      const district = this._getKind(components, YandexAddressType.district) || '';
      const countryCode = place.properties._data.metaDataProperty.GeocoderMetaData.Address.country_code || '';
      const postCode = '';
      const city = locality || this._getKind(components, YandexAddressType.city) || '';
      return { country, postCode, street, countryCode, house, district, city };
    } catch { }
  }

  private _getComponent(components: any, name: string) {
    return components.filter((component) => component.kind === name);
  }

  private _getKind(components: any, name: string) {
    try {
      const component = this._getComponent(components, name);
      return component && component[0].name;
    } catch {
    }
  }

}

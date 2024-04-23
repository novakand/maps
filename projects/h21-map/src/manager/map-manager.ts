import { Injectable } from '@angular/core';

// enums
import { MapType } from '../enums/map-type.enum';

// services
import { MapService } from '../services/abstract/abstract-map';
import { BaiduMapService } from '../services/baidu/baidu-map';
import { GoogleMapService } from '../services/google/google-map';
import { MapboxMapService } from '../services/mapbox/mapbox-map';
import { YandexMapService } from '../services/yandex/yandex-map';

@Injectable()
export class MapManager {

  private _selectedMap: MapType;
  private _map: MapService<any, any, any>;
  private _hashtable: { [name: string]: MapService<any, any, any> } = {};

  constructor(
    private googleMap: GoogleMapService,
    private baiduMap: BaiduMapService,
    private yandexMap: YandexMapService,
    private mapboxMap: MapboxMapService,
  ) {
    this._register(MapType.google, this.googleMap);
    this._register(MapType.baidu, this.baiduMap);
    this._register(MapType.yandex, this.yandexMap);
    this._register(MapType.mapbox, this.mapboxMap);
  }

  public selectMap(type: MapType): void {
    this._map = this._hashtable[type];
    this._selectedMap = type;
  }

  public selectMapType(): MapType {
    return this._selectedMap;
  }

  public destroy(): void {
    try {
      this._currentMap.destroy();
    } catch { }
  }

  public changeType(type: MapType): void { }

  public getMap(): MapService<any, any, any> {
    return this._map;
  }

  private get _currentMap(): MapService<any, any, any> {
    return this._map;
  }

  private _register(type: MapType, map: MapService<any, any, any>): MapManager {
    this._hashtable[type] = map;
    return this;
  }

}

import {
  Injectable,
  NgZone
} from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// libs
import { ZoomBox } from '@h21-map/yandex-zoom-box';

// enums
import { CursorType } from '../../enums/cursor-type.enum';
import { YandexLanguageCode } from '../../enums/yandex/yandex-language-code.enum';

// interfaces
import { IPolylineOptions } from '../../interfaces/polyline-options.interface';
import { MarkerOptions } from '../../interfaces/marker-options.interface';

// models
import { YandexApiConfig } from '../../models/yandex/yandex-api-config.model';
import { MapOptions } from '../../models/map-options.model';
import { YandexLanguageDictionary } from '../../models/yandex/yandex-language.model';
import { Position } from '../../models/position.model';
import { ClientPosition } from '../../models/event-client-pixel.model';

// services
import { MapService } from '../abstract/abstract-map';
import { YandexEventService } from './yandex-event';
import { YandexDataLayerService } from './yandex-data-layer';
import { YandexMarkerClusterService } from './yandex-cluster';
import { YandexSearchService } from './yandex-search';
import { YandexRouteService } from './yandex-route';
import { YandexMarkerService } from './yandex-marker';
import { YandexGeocodingService } from './yandex-geocoding';
import { YandexGeoLocationService } from './yandex-geolocation';
import { YandexConversionsService } from './yandex-conversions';
import { YandexDrawingService } from './yandex-drawing';
import { YandexBoundarService } from './yandex-boundar';
import { YandexDistanceService } from './yandex-distance';
import { YandexAddressService } from './yandex-address';

declare var ymaps;

@Injectable()
export class YandexMapService extends MapService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public overlayMap: ymaps.IOverlay;

  constructor(
    public apiConfig: YandexApiConfig,
    public address: YandexAddressService,
    public dataLayer: YandexDataLayerService,
    public drawing: YandexDrawingService,
    public distance: YandexDistanceService,
    public events: YandexEventService,
    public marker: YandexMarkerService,
    public cluster: YandexMarkerClusterService,
    public search: YandexSearchService,
    public route: YandexRouteService,
    public geocoding: YandexGeocodingService,
    public geolocation: YandexGeoLocationService,
    public conversions: YandexConversionsService,
    public boundar: YandexBoundarService,
    private _zone: NgZone,
  ) {
    super(
      apiConfig,
      address,
      dataLayer,
      drawing,
      distance,
      events,
      marker,
      cluster,
      search,
      route,
      geocoding,
      geolocation,
      conversions,
      boundar,
    );
  }

  public get scriptSelector(): string {
    return 'script[src*=\'api-maps.yandex\']';
  }

  public get styleSelector(): string {
    return '.ymaps-2-1-72-';
  }

  public get scriptId(): string {
    return this.apiConfig.name;
  }

  public get scriptUrl(): string {
    return `${this.apiConfig.url}/${this.apiConfig.version}/?apikey=${this.apiConfig.key}${''
      }&lang=${this.apiConfig.language}`;
  }

  public createPolyline(polylineOptions: IPolylineOptions): Observable<any> {
    return new Observable((observer: Observer<ymaps.Polyline>) => {
      const options: ymaps.IPolylineOptions = {
        fillOpacity: polylineOptions.fillOpacity,
        strokeColor: polylineOptions.strokeColor,
        strokeOpacity: polylineOptions.strokeOpacity,
        strokeWidth: polylineOptions.strokeWeight,
        geodesic: polylineOptions.geodesic,
        syncOverlayInit: true,
        strokeStyle: polylineOptions.symbol,
      };

      observer.next(new ymaps.Polyline([], {}, options));
    });
  }

  public createMarker(markerOptions: MarkerOptions = new MarkerOptions()): Observable<any> {
    return new Observable((observer: Observer<ymaps.GeoObject>) => {
      const geo = {
        geometry: {
          type: 'Point',
          coordinates: [markerOptions.position.latitude, markerOptions.position.longitude],
        },
      };

      const temp = `<div class="h21-map-price-marker">${markerOptions.labelContent}</div>`;
      const options = {
        iconLayout: markerOptions.labelContent ? 'default#imageWithContent' : 'default#image',
        iconImageSize: markerOptions.labelContent ? [81, 30] :
          [markerOptions.icon.width, markerOptions.icon.height],
        iconImageOffset: markerOptions.labelContent ? [-40, -20] : [-7, -10],
        iconContentOffset: [40, 0],
        syncOverlayInit: true,
        iconImageHref: markerOptions.labelContent ? '/' : markerOptions.icon.url,
        zIndex: markerOptions.zIndex,
        zIndexHover: markerOptions.zIndex,
        showHintOnHover: false,
        hasBalloon: false,
        hasHint: false,
        iconContentLayout: markerOptions.labelContent ? ymaps.templateLayoutFactory.createClass(temp) : null,
      };
      observer.next(new ymaps.GeoObject(geo, options));
    });
  }

  public createMap(htmlElement: HTMLElement, mapOptions: MapOptions): Observable<boolean> {
    try {
      this.container = htmlElement;
      return new Observable((observer: Observer<boolean>) => {
        const options: ymaps.IMapState = {
          center: [mapOptions.center.latitude, mapOptions.center.longitude],
          behaviors: ['default', 'scrollZoom'],
          zoom: mapOptions.zoom,
          controls: mapOptions.enableDefaultControl ? ['zoomControl'] : [],
        };
        this.api = new ymaps.Map(htmlElement, options);

        this.api.options.set('yandexMapDisablePoiInteractivity', [true]);
        this.api.options.set('suppressMapOpenBlock', [false]);
        this.api.options.set('minZoom', [mapOptions.minZoom]);
        this.api.options.set('maxZoom', [mapOptions.maxZoom]);
        this.api.options.set('restrictMapArea', [[-83.8, -170.8], [83.8, 170.8]]);
        this.api.behaviors.get('drag').options.set('inertia', false);
        let cursor = mapOptions.defaultCursor;
        mapOptions.defaultCursor === CursorType.default ? cursor = 'inherit' : cursor = mapOptions.defaultCursor;
        this.api.cursors.push(cursor);
        const dbClickZoom = this.api.behaviors.get('dblClickZoom');
        const scrollZoom = this.api.behaviors.get('scrollZoom');
        this.api.behaviors.get('rightMouseButtonMagnifier').disable();
        mapOptions.enableDoubleClickZoom ? dbClickZoom.enable() : dbClickZoom.disable();
        mapOptions.enableScrollwheel ? scrollZoom.enable() : scrollZoom.disable();
        this._zone.run(() => this.loadMap$.next(true));
        this._zone.run(() => observer.next(true));
      });

    } catch { }
  }

  public setDefaultCursor(cursor: CursorType): void {
    cursor === CursorType.pickUp
      || cursor === CursorType.dropDown
      || cursor === CursorType.destination ?
      this._setImgCursor(cursor) :
      this.api.cursors.push(cursor);
  }

  public getZoom(): number {
    return this.api.getZoom();
  }

  public getMinZoom(): number {
    return this.api.options.get('minZoom', {})[0];
  }

  public getMaxZoom(): any {
    return this.api.options.get('maxZoom', {})[0];
  }

  public getOverlay<E>(): E {
    return <E><unknown>this.overlayMap;
  }

  public setZoom(zoom: number): void {
    this.api.setZoom(zoom);
  }

  public setMinZoom(zoom: number): void {
    this.api.options.set('minZoom', [zoom]);
  }

  public setMaxZoom(zoom: number): void {
    this.api.options.set('maxZoom', [zoom]);
  }

  public setDraggable(enabled: any): void {
    enabled ? this.api.behaviors.get('drag').enable() : this.api.behaviors.get('drag').disable();
  }

  public setScrollwheel(enabled: boolean): void {
    enabled ? this.api.behaviors.get('scrollZoom').enable() : this.api.behaviors.get('scrollZoom').disable();
  }

  public setDoubleClickZoom(enabled: boolean): void {
    enabled ? this.api.behaviors.get('dblClickZoom').enable() : this.api.behaviors.get('dblClickZoom').disable();
  }

  public setClick(enabled: boolean): void {
    this.clickMap = enabled;
  }

  public setCenter(latitude: number, longitude: number, zoom: number): void {
    this.api.setCenter([latitude, longitude]);
    zoom && this.setZoom(zoom);
  }

  public setResize(): void {
    this.api.container.fitToViewport();
  }

  public setZoomIn(): void {
    this.api.setZoom(this.getZoom() + 1);
  }

  public setZoomOut(): void {
    this.api.setZoom(this.getZoom() - 1);
  }

  public setZoomBox(enabled): void {
  }

  public fitBounds(positions?: Position[]): void {
    try {
      const options = {
        checkZoomRange: false,
        useMapMargin: true,
        duration: 180,
      };

      this.api.geoObjects.getBounds() && this.api.setBounds(this.api.geoObjects.getBounds(), options);
    } catch { }
  }

  public setPanBy(clientX: number, clientY: number): void {
    const options: ymaps.IMapPositionOptions = {
      duration: 300,
      checkZoomRange: true,
      timingFunction: 'ease-out',

    };
    const position = this.api.getGlobalPixelCenter();
    this.api.setGlobalPixelCenter([position[0] - clientX, position[1] - clientY], this.api.getZoom(), options);
  }

  public fromLatLngToPixel(latitude: number, longitude: number): ClientPosition {
    const projection: any = this.api.options.get('projection', {});
    const px = this.api.converter.globalToPage(
      projection.toGlobalPixels(
        [latitude, longitude],
        this.api.getZoom(),
      ),
    );
    const offset = this.api.container.getOffset();
    const pixel = new ClientPosition();
    pixel.clientX = px[0] - offset[0] + 5;
    pixel.clientY = px[1] - offset[1] + 10;
    return pixel;
  }

  public loadAPI(lang): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      try {
        if (lang) {
          const _lang = YandexLanguageCode[lang] || YandexLanguageCode.en;
          this.apiConfig.language = _lang;
        }

        if (!this.getScriptName(this.apiConfig.name)) {
          const script = this.getScript();
          this.documentRef.getNativeDocument().body.appendChild(script);
          script.onload = () => {
            ymaps.ready(() => {
              this._zone.run(() => observer.next(true));
            }, 600);
          };
        } else {
          setTimeout(() => {
            ymaps.ready(() => {
              this._zone.run(() => observer.next(true));
            });
          }, 800);
        }
      } catch {
        this._zone.run(() => observer.next(false));
      }
    });
  }

  public getLanguageDictionary(): any {
    return new YandexLanguageDictionary().language;
  }

  public getStaticUrl(latitude: number, longitude: number, iconUrl: string): string {
    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/url-${encodeURIComponent(iconUrl)}(${[longitude, latitude]})/${''
    }${longitude},${latitude},16,0/400x400@2x?access_token=${this.apiConfig.key}`;
  }

  public destroy(): void {
    if (JSON.parse(this.containerId)) {
      this.api.destroy();
      super.destroy();
    }
  }

  private _setImgCursor(cursor): void {
    this.api.container.getElement().style.cursor = `url(${cursor}), auto`;
  }

}

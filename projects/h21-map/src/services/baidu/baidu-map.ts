import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// enums
import { CursorType } from '../../enums/cursor-type.enum';

// interface
import { MarkerOptions } from '../../interfaces/marker-options.interface';
import { IPolylineOptions } from '../../interfaces/polyline-options.interface';

// models
import { BaiduApiConfig } from '../../models/baidu/baidu-api-config.model';
import { BaiduLanguageDictionary } from '../../models/baidu/baidu-language.model';
import { ClientPosition } from '../../models/event-client-pixel.model';
import { MapOptions } from '../../models/map-options.model';

// services
import { MapService } from '../abstract/abstract-map';
import { BaiduAddressService } from './baidu-address';
import { BaiduBoundarService } from './baidu-boundar';
import { BaiduDataLayerService } from './baidu-data-layer';
import { BaiduMarkerClusterService } from './baidu-cluster';
import { BaiduConversionsService } from './baidu-conversions';
import { BaiduDistanceService } from './baidu-distance';
import { BaiduDrawingService } from './baidu-drawing';
import { BaiduEventService } from './baidu-event';
import { BaiduGeocodingService } from './baidu-geocoding';
import { BaiduGeoLocationService } from './baidu-geolocation';
import { BaiduMarkerService } from './baidu-marker';
import { BaiduRouteService } from './baidu-route';
import { BaiduSearchService } from './baidu-search';

declare var BMap;

@Injectable()
export class BaiduMapService extends MapService<BMap.Map, BMap.Marker, BMap.Polyline> {

  public overlayMap: BMap.Overlay;

  constructor(
    public apiConfig: BaiduApiConfig,
    public address: BaiduAddressService,
    public dataLayer: BaiduDataLayerService,
    public drawing: BaiduDrawingService,
    public distance: BaiduDistanceService,
    public events: BaiduEventService,
    public marker: BaiduMarkerService,
    public cluster: BaiduMarkerClusterService,
    public search: BaiduSearchService,
    public route: BaiduRouteService,
    public geocoding: BaiduGeocodingService,
    public geolocation: BaiduGeoLocationService,
    public conversions: BaiduConversionsService,
    public boundar: BaiduBoundarService,
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
    return 'script[src*=\'api.map.baidu\']';
  }

  public get styleSelector(): string {
    return '.BMap_mask';
  }

  public get scriptId(): string {
    return this.apiConfig.name;
  }

  public get scriptUrl(): string {
    return `${this.apiConfig.url}?v=${this.apiConfig.version}&ak=${this.apiConfig.key}${''
      }&language=${this.apiConfig.language}&callback=${this.apiConfig.callback}`;
  }

  public createPolyline(polylineOptions: IPolylineOptions): Observable<BMap.Polyline> {
    return new Observable((observer: Observer<BMap.Polyline>) => {
      const options: BMap.PolylineOptions = {
        strokeColor: polylineOptions.strokeColor,
        strokeOpacity: 0,
        strokeStyle: polylineOptions.symbol,
        strokeWeight: polylineOptions.strokeWeight,
        icons: null,
      };
      observer.next(new BMap.Polyline([], options));
    });
  }

  public createMarker(markerOptions: MarkerOptions): Observable<BMap.Marker> {
    try {
      return new Observable((observer: Observer<BMap.Marker>) => {
        const icon = markerOptions.icon.url ?
          new BMap.Icon(markerOptions.icon.url, new BMap.Size(markerOptions.icon.width, markerOptions.icon.height)) : null;

        const options: BMap.MarkerOptions = {
          icon: icon,
        };

        const position = new BMap.Point(markerOptions.position.longitude, markerOptions.position.latitude);
        const marker: BMap.Marker = new BMap.Marker(position, options);
        marker.setIcon(icon);
        observer.next(marker);

      });
    } catch (error) {
    }
  }

  public createMap(htmlElement: HTMLElement, mapOptions: MapOptions): Observable<boolean> {
    this.container = htmlElement;
    return new Observable((observer: Observer<boolean>) => {
      try {
        const options: BMap.MapOptions = {
          minZoom: mapOptions.minZoom,
          maxZoom: mapOptions.maxZoom,
          enableAutoResize: true,
        };
        this.api = new BMap.Map(htmlElement, options);
        this.api.centerAndZoom(new BMap.Point(mapOptions.center.longitude, mapOptions.center.latitude), mapOptions.zoom + 1);
        this.api.setDefaultCursor(mapOptions.defaultCursor);
        this.api.disableInertialDragging();
        this.api.enableDragging();
        this.api.setMapStyle({ style: 'grayscale' });
        mapOptions.enableDoubleClickZoom ? this.api.enableDoubleClickZoom() : this.api.disableDoubleClickZoom();
        mapOptions.enableScrollwheel ? this.api.enableScrollWheelZoom() : this.api.disableScrollWheelZoom();
        this._zone.run(() => this.loadMap$.next(true));
        this._zone.run(() => observer.next(true));

      } catch (error) {
        this._zone.run(() => this.loadMap$.next(false));
        this._zone.run(() => observer.next(true));
      }
    });
  }

  public setDefaultCursor(cursor: CursorType): void {
    cursor === CursorType.pickUp
      || cursor === CursorType.dropDown
      || cursor === CursorType.destination ?
      this._setImgCursor(cursor) :
      this.api.setDefaultCursor(cursor);
  }

  public getZoom(): number {
    return this.api.getZoom();
  }

  public setZoom(zoom: number): void {
    this.api.setZoom(zoom);
  }

  public setMinZoom(zoom: number): void {
    this.api.setMinZoom(zoom);
  }

  public getMinZoom(): number {
    return this.api.getMapType().getMinZoom();
  }

  public getMaxZoom(): number {
    return this.api.getMapType().getMaxZoom();
  }

  public setMaxZoom(zoom: number): void {
    this.api.setMaxZoom(zoom);
  }

  public getOverlay<E>(): E {
    return <E><unknown>this.overlayMap;
  }

  public setDraggable(enabled: boolean) {
    enabled ? this.api.enableDragging() : this.api.disableDragging();
  }

  public setScrollwheel(enabled: boolean): void {
    enabled ? this.api.enableScrollWheelZoom() : this.api.disableScrollWheelZoom();
  }

  public setDoubleClickZoom(enabled: boolean): void {
    enabled ? this.api.enableDoubleClickZoom() : this.api.disableDoubleClickZoom();
  }

  public setClick(enabled: boolean): void {
    this.clickMap = enabled;
  }

  public setCenter(latitude: number, longitude: number): void {
    this.api.setCenter(new BMap.Point(longitude, latitude));
  }

  public setResize(): void {
    this.api.checkResize();
  }

  public setZoomIn(): void {
    this.api.setZoom(this.getZoom() + 1);
  }

  public setZoomOut(): void {
    this.api.setZoom(this.getZoom() - 1);
  }

  public setZoomBox(enabled): void {
  }

  public fitBounds(positions?: []): void {

    const bounds = this.api.getBounds();
    this.marker.markers.forEach((value) => {
      bounds.extend(value.getPosition());
    });

    this.route.routes.forEach((value) => {
      value.getPath().forEach((latLng) => {
        bounds.extend(latLng);
      });
    });

    if (this.drawing.marker) {
      bounds.extend(new BMap.Point(this.drawing.marker.position.longitude, this.drawing.marker.position.latitude));
    }

    if (this.drawing.area && this.drawing.area.position.length) {
      this.drawing.area.position.forEach((values, index) => {
        bounds.extend(new BMap.Point(values[index].longitude, values[index].latitude));
      });
    }

    this.api.setViewport(bounds);
  }

  public setPanBy(clientX: number, clientY: number): void {
    const options = {
      noAnimation: false,
    };
    this.api.panBy(clientX, clientY, options);
  }

  public fromLatLngToPixel(latitude: number, longitude: number): ClientPosition {
    const px = this.api.pointToPixel(new BMap.Point(longitude, latitude));
    const pixel = new ClientPosition();
    pixel.clientX = px.x;
    pixel.clientY = px.y;
    return pixel;
  }

  public loadAPI(lang): Observable<boolean> {
    try {
      return new Observable((observer: Observer<boolean>) => {
        if (lang) {
          this.apiConfig.language = lang;
        }

        if (!this.getScriptName(this.apiConfig.name)) {
          const script = this.getScript();
          this.documentRef.getNativeDocument().body.appendChild(script);
          script.onload = () => {
            setTimeout(() => {
              observer.next(true);
            }, 5000);

          };
        } else {
          setTimeout(() => {
            observer.next(true);
          }, 5000);

        }

      });
    } catch (err) {
    }
  }

  public getLanguageDictionary(): any {
    return new BaiduLanguageDictionary().language;
  }

  public getStaticUrl(latitude: number, longitude: number, iconUrl: string): string {
    return null;

  }

  public destroy(): void {
    try {

      if (this.api) {
        this.api.clearOverlays();
        this.api.clearHotspots();
        this.api.reset();
      }
      super.destroy();
    } catch (error) {
    }
  }

  private _setImgCursor(cursor): void {
    this.api.setDefaultCursor(`url(${cursor}), auto`);
  }

}

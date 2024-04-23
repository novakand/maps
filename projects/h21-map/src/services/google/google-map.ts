import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';
import * as Marker from '@h21-map/google-marker-label';

// services
import { MapService } from '../abstract/abstract-map';
import { GoogleAddressService } from './google-address';
import { GoogleDataLayerService } from './google-data-layer';
import { GoogleEventService } from './google-event';
import { GoogleMarkerClusterService } from './google-cluster';
import { GoogleSearchService } from './google-search';
import { GoogleMarkerService } from './google-marker';
import { GoogleRouteService } from './google-route';
import { GoogleGeocodingService } from './google-geocoding';
import { GoogleGeoLocationService } from './google-geolocation';
import { GoogleConversionsService } from './google-conversions';
import { GoogleDrawingService } from './google-drawing';
import { GoogleDistanceService } from './google-distance';
import { GoogleBoundarService } from './google-boundar';

// interfaces
import { MarkerOptions } from '../../interfaces/marker-options.interface';
import { IPolylineOptions } from '../../interfaces/polyline-options.interface';

// models
import { GoogleStyleMap } from '../../models/google/google-map-style.model';
import { GoogleApiConfig } from '../../models/google/google-api-config.model';
import { Position } from '../../models/position.model';
import { ClientPosition } from '../../models/event-client-pixel.model';
import { GoogleLanguageDictionary } from '../../models/google/google-language.model';
import { MapOptions } from '../../models/map-options.model';

// enums
import { CursorType } from '../../enums/cursor-type.enum';
import { GoogleErrorMessages } from '../../enums/google/google-messages-error';

declare var google: any;

@Injectable()
export class GoogleMapService extends MapService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public overlayMap: google.maps.OverlayView;

  constructor(
    public apiConfig: GoogleApiConfig,
    public address: GoogleAddressService,
    public dataLayer: GoogleDataLayerService,
    public drawing: GoogleDrawingService,
    public distance: GoogleDistanceService,
    public events: GoogleEventService,
    public marker: GoogleMarkerService,
    public cluster: GoogleMarkerClusterService,
    public search: GoogleSearchService,
    public route: GoogleRouteService,
    public geocoding: GoogleGeocodingService,
    public geoLocation: GoogleGeoLocationService,
    public conversions: GoogleConversionsService,
    public boundar: GoogleBoundarService,
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
      geoLocation,
      conversions,
      boundar,
    );
  }

  public get scriptSelector(): string {
    return 'script[src*=\'maps.googleapis.com\']';
  }

  public get styleSelector(): string {
    return '.gm-style';
  }

  public get scriptId(): string {
    return this.apiConfig.name;
  }

  public get scriptUrl(): string {
    return `${this.apiConfig.url}&v=${this.apiConfig.version}&key=${this.apiConfig.key}${''
      }&language=${this.apiConfig.language}`;
  }

  public createPolyline(polylineOptions: IPolylineOptions): Observable<any> {
    return new Observable((observer: Observer<google.maps.Polyline>) => {

      polylineOptions.symbol ?
        polylineOptions.strokeOpacity = 0
        : polylineOptions.strokeOpacity = 1;

      polylineOptions.symbol != null ?
        polylineOptions.symbol = polylineOptions.symbol
        : polylineOptions.symbol = {};


      const options: google.maps.PolylineOptions = {
        path: [],
        strokeColor: polylineOptions.strokeColor,
        strokeOpacity: polylineOptions.strokeOpacity,
        strokeWeight: polylineOptions.strokeWeight,
        geodesic: polylineOptions.geodesic,
        icons: [polylineOptions.symbol],
        clickable: false,
        editable: false,
      };
      observer.next(new google.maps.Polyline(options));
    });
  }

  public getMinZoom(): number {
    return this.api.get('minZoom');
  }

  public getMaxZoom(): number {
    return this.api.get('maxZoom');
  }

  public getOverlay<E>(): E {
    return <E><unknown>this.overlayMap;
  }

  public createMarker(markerOptions: MarkerOptions = new MarkerOptions()): Observable<google.maps.Marker> {
    return new Observable((observer: Observer<google.maps.Marker>) => {

      const icon = {
        url: markerOptions.icon.url,
        anchor: markerOptions.labelContent ? null : new google.maps.Point(12, 31),
        size: markerOptions.labelContent ? null : new google.maps.Size(markerOptions.icon.width, markerOptions.icon.height),
      };

      const options = {
        visible: markerOptions.labelContent ? false : true,
        position: new google.maps.LatLng(markerOptions.position.latitude, markerOptions.position.longitude),
        icon: markerOptions.labelContent ? null : icon,
        zIndex: markerOptions.zIndex || 99,
        opacity: markerOptions.labelContent ? 0 : 1,
        labelVisible: markerOptions.labelContent ? true : false,
        labelContent: markerOptions.labelContent,
        labelAnchor: new google.maps.Point(0, 30),
        labelClass: (markerOptions.labelContent) && markerOptions.labelClass,
      };

      const markerLabel = Marker.default(google.maps);
      observer.next(new markerLabel(options));
    });
  }

  public createMap(htmlElement: HTMLElement, mapOptions: MapOptions): Observable<boolean> {
    this.container = htmlElement;
    return new Observable((observer: Observer<boolean>) => {
      const options: google.maps.MapOptions = {
        center: new google.maps.LatLng(mapOptions.center.latitude, mapOptions.center.longitude),
        zoom: mapOptions.zoom,
        minZoom: mapOptions.minZoom,
        maxZoom: mapOptions.maxZoom,
        clickableIcons: false,
        scrollwheel: mapOptions.enableScrollwheel,
        disableDefaultUI: !mapOptions.enableDefaultControl,
        disableDoubleClickZoom: !mapOptions.enableDoubleClickZoom,
        draggableCursor: mapOptions.defaultCursor,
        draggable: mapOptions.enableDraggable,
        restriction: { latLngBounds: { north: 83.8, south: -83.8, west: -180, east: 180 } },
        styles: new GoogleStyleMap().style,
      };

      this.api = new google.maps.Map(htmlElement, options);
      this.overlayMap = new google.maps.OverlayView();
      this.overlayMap.setMap(this.api);
      this._zone.run(() => this.loadMap$.next(true));
      this._zone.run(() => observer.next(true));
    });
  }

  public setZoom(zoom: number): void { this.api.setZoom(zoom); }
  public setMinZoom(zoom: number): void { this.api.setOptions({ minZoom: zoom }); }
  public setMaxZoom(zoom: number): void { this.api.setOptions({ maxZoom: zoom }); }

  public setCenter(latitude: number, longitude: number, zoom: number): void {
    this.api.setCenter(new google.maps.LatLng(latitude, longitude));
    zoom && this.setZoom(zoom);
  }

  public setDraggable(enabled: any): void { this.api.setOptions({ draggable: enabled }); }
  public setScrollwheel(enabled: boolean): void { this.api.setOptions({ scrollwheel: enabled }); }
  public setDoubleClickZoom(enabled: boolean): void { this.api.setOptions({ disableDoubleClickZoom: !enabled }); }
  public setClick(enabled: boolean): void { this.clickMap = enabled; }

  public setDefaultCursor(cursor: CursorType): void {
    cursor === CursorType.pickUp
      || cursor === CursorType.dropDown
      || cursor === CursorType.destination ?
      this._setImgCursor(cursor) :
      this.api.setOptions({ draggableCursor: cursor });
  }

  public setResize(): void { google.maps.event.trigger(this.api, 'resize'); }
  public setZoomIn(): void { this.api.setZoom(this.getZoom() + 1); }

  public fitBounds(positions?: Position[]): void {
    try {
      const bounds = new google.maps.LatLngBounds();

      if (positions && positions.length) {
        positions.forEach((value: Position) => {
          bounds.extend(new google.maps.LatLng(value.latitude, value.longitude));
          if (!this._checkBounds(bounds)) {
            return;
          }
          this.api.fitBounds(bounds);
        });
      }

      if (positions && positions.length) { return; }

      this.marker.markers.forEach((value) => {
        bounds.extend(value.getPosition());
      });

      this.route.routes.forEach((value) => {
        value.getPath().forEach((latLng) => {
          bounds.extend(latLng);
        });
      });

      this.drawing.marker &&
        bounds.extend(new google.maps.LatLng(this.drawing.marker.position.latitude, this.drawing.marker.position.longitude));

      this.drawing.circle && bounds.union(this.drawing.circle.bounds);

      if (this.drawing.area && this.drawing.area.position.length) {
        this.drawing.area.position.forEach((value: Position) => {
          bounds.extend(new google.maps.LatLng(value.latitude, value.longitude));
        });
      }

      if (!this._checkBounds(bounds)) {
        return;
      }
      this.api.fitBounds(bounds);

    } catch { }
  }

  public setZoomBox(enabled): void { }

  public setZoomOut(): void {
    this.api.setZoom(this.getZoom() - 1);
  }

  public setPanBy(clientX: number, clientY: number): void {
    clientX < 0 ?
      clientX = Math.abs(clientX)
      : clientX = 0 - clientX;
    this.api.panBy(clientX, 0 - clientY);
  }

  public getZoom(): number {
    return this.api.getZoom();
  }

  public fromLatLngToPixel(latitude: number, longitude: number): ClientPosition {
    const position = new google.maps.LatLng(latitude, longitude);
    this.api.getProjection().fromLatLngToPoint(position);
    const scale = Math.pow(2, this.api.getZoom());
    const proj = this.api.getProjection();
    const bounds = this.api.getBounds();
    const nw = proj.fromLatLngToPoint(
      new google.maps.LatLng(
        bounds.getNorthEast().lat(),
        bounds.getSouthWest().lng(),
      ));
    const point = proj.fromLatLngToPoint(position);
    const pixel = new ClientPosition();
    pixel.clientX = Math.floor((point.x - nw.x) * scale);
    pixel.clientY = Math.floor((point.y - nw.y) * scale);
    pixel.position = new Position(latitude, longitude);
    return pixel;
  }

  public loadAPI(lang, apiKey: string): Observable<boolean> {
    try {
      return new Observable((observer: Observer<boolean>) => {
        if (lang) {
          this.apiConfig.language = lang;
        }
        if (apiKey) {
          this.apiConfig.key = apiKey;
        }

        if (!this.getScriptName(this.apiConfig.name)) {
          const script = this.getScript();
          this.documentRef.getNativeDocument().body.appendChild(script);
          script.onload = () => {
            setTimeout(() => {
              this._zone.run(() => observer.next(true));
            }, 800);
          };

          script.onerror = () => {
            this._zone.run(() => observer.next(false));
            this._zone.run(() => this.loadMap$.next(false));
          };
        } else {
          setTimeout(() => {
            this._zone.run(() => observer.next(true));
          }, 1000);

        }

        window[this.apiConfig.handlerError] = () => {
          window.console.error = (error) => {
            this.matchExact(error);
          };
        };

      });
    } catch { }
  }

  public matchExact(stringError: string) {
    const obj = Object.keys;
    const types = GoogleErrorMessages;
    for (const n of obj(types)) {
      const hits = stringError.match(`(${n})\\s`);
      if (hits != null && hits.length > 0) {
        this.mapErrorAPI.next(GoogleErrorMessages[hits[1]]);
      }
    }
  }

  public getLanguageDictionary(): any {
    return new GoogleLanguageDictionary().language;
  }

  public getStaticUrl(latitude: number, longitude: number, iconUrl: string): string {
    return `https://maps.googleapis.com/maps/api/staticmap?style=feature:all|saturation:-100&size=400x400&maptype=roadmap&${''
      }markers=anchor:-1,10|icon:${encodeURIComponent(iconUrl)}|${latitude},${''
      }${longitude}&language=${this.apiConfig.language}&key=${this.apiConfig.key}`;
  }

  public destroy(): void {
    if (JSON.parse(this.containerId)) {
      this.api.overlayMapTypes.clear();
      google.maps.event.clearInstanceListeners(this.windowRef.getNativeWindow());
      google.maps.event.clearInstanceListeners(this.documentRef.getNativeDocument());
      delete google.maps;
      super.destroy();
    }

    if (this.container) {
      this.container.innerText = '';
    }
  }

  private _setImgCursor(cursor: string): void {
    this.api.setOptions({ draggableCursor: `url(${cursor}), auto` });
  }

  private _checkBounds(bounds): boolean {
    let ret = true;
    if (bounds.ga) {
      if (bounds.ga.j === 180
        && bounds.ga.l === -180
        && bounds.na.j === 1
        && bounds.na.l === -1) {
        ret = false;
      }
    }
    return ret;
  }

}

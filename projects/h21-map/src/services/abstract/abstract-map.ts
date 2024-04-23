import { Injectable } from '@angular/core';
import { Fullscreen } from '@h21-map/fullscreen';

// external libs
import { BehaviorSubject, Observable, Subject, } from 'rxjs';

// enums
import { LanguageCode } from '../../enums/language-service.enum';
import { CursorType } from '../../enums/cursor-type.enum';

// interfaces
import { IPolylineOptions } from '../../interfaces/polyline-options.interface';
import { MarkerOptions } from '../../interfaces/marker-options.interface';
import { IApiConfig } from '../../interfaces/api-settings.interface';

// models
import { DocumentRef } from '../../models/document-ref.model';
import { ClientPosition } from '../../models/event-client-pixel.model';
import { MapOptions } from '../../models/map-options.model';
import { Position } from '../../models/position.model';
import { WindowRef } from '../../models/window-ref.model';

// services
import { AddressService } from './abstract-address';
import { BoundarService } from './abstract-boundar';
import { DataLayerService } from './abstract-data-layer';
import { MarkerClusterService } from './abstract-cluster';
import { ConversionsService } from './abstract-conversions';
import { DistanceService } from './abstract-distance';
import { DrawingService } from './abstract-drawing';
import { EventService } from './abstract-event';
import { GeoCodingService } from './abstract-geocoding';
import { GeolocationService } from './abstract-geolocation';
import { MarkerService } from './abstract-marker';
import { RouteService } from './abstract-route';
import { SearchService } from './abstract-search';

@Injectable()
export abstract class MapService<T, U, N> {

  public fullscreen = new Fullscreen();
  public api: T;
  public fitBonds = true;
  public clickMap = true;
  public loadMap$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public mapErrorAPI: Subject<string> = new Subject<string>();
  public mapContainer: HTMLElement;
  protected windowRef: WindowRef = new WindowRef();
  protected documentRef: DocumentRef = new DocumentRef();

  constructor(
    public apiConfig: IApiConfig,
    public address: AddressService<T, U, N>,
    public dataLayer: DataLayerService<T, U, N>,
    public drawing: DrawingService<T, U, N>,
    public distance: DistanceService<T, U, N>,
    public events: EventService<T, U, N>,
    public marker: MarkerService<T, U, N>,
    public cluster: MarkerClusterService<T, U, N>,
    public search: SearchService<T, U, N>,
    public route: RouteService<T, U, N>,
    public geocoding: GeoCodingService<T, U, N>,
    public geolocation: GeolocationService<T, U, N>,
    public conversions: ConversionsService<T, U, N>,
    public boundar: BoundarService<T, U, N>,
  ) {
    this.events.initMap(this);
    this.marker.initMap(this);
    this.drawing.initMap(this);
    this.distance.initMap(this);
    this.dataLayer.initMap(this);
    this.cluster.initMap(this);
    this.search.initMap(this);
    this.route.initMap(this);
    this.geolocation.initMap(this);
    this.geocoding.initMap(this);
    this.conversions.initMap(this);
    this.boundar.initMap(this);
  }

  public get container(): HTMLElement {
    return this.mapContainer;
  }

  public set container(mapContainer) {
    this.mapContainer = mapContainer;
  }

  public abstract get styleSelector(): string;

  public abstract get scriptSelector(): string;

  public abstract get scriptId(): string;

  public abstract get scriptUrl(): string;

  public get containerId(): string {
    return this.container.getAttribute('map-main');
  }

  public abstract createMap(container: HTMLElement, mapOptions: MapOptions): Observable<boolean>;

  public abstract createMarker(markerOptions: MarkerOptions): Observable<any>;

  public abstract createPolyline(polylineOptions: IPolylineOptions): Observable<any>;

  public abstract loadAPI(lang: LanguageCode, apiKey?: string): Observable<boolean>;

  public abstract setZoom(zoom: number): void;

  public abstract setMinZoom(zoom: number): void;

  public abstract setMaxZoom(zoom: number): void;

  public abstract setDraggable(enabled: boolean): void;

  public abstract setScrollwheel(enabled: boolean): void;

  public abstract setDoubleClickZoom(enabled: boolean): void;

  public abstract setClick(enabled: boolean): void;

  public abstract setCenter(latitude: number, longitude: number, zoom?: number): void;

  public abstract setDefaultCursor(cursor: CursorType): void;

  public abstract setPanBy(clientX: number, clientY: number): void;

  public abstract setResize(): void;

  public abstract setZoomIn(): void;

  public abstract setZoomOut(): void;

  public abstract getMinZoom(): number;

  public abstract getMaxZoom(): number;

  public abstract getOverlay<E>(): E;

  public abstract setZoomBox(enabled: boolean): void;

  public abstract getZoom(): number;

  public abstract getStaticUrl(latitude: number, longitude: number, IconUrl: string): string;

  public abstract fitBounds(positions?: Position[]): void;

  public abstract getLanguageDictionary(): any;

  public abstract fromLatLngToPixel(latitude: number, longitude: number): ClientPosition;

  public setFullscreen(enabled: boolean): void {
    enabled ?
      this.fullscreen.open(this.documentRef.getNativeDocument().getElementsByClassName('c-h21-map').item(Number(this.containerId))) :
      this.fullscreen.close();
  }

  public getScriptName(nameScipt) {
    return this.documentRef.getNativeDocument().getElementById(nameScipt);
  }

  public setFitBounds(enabled: boolean): void {
    this.fitBonds = enabled;
  }

  public getScript(): HTMLScriptElement {
    const script = this.documentRef.getNativeDocument().createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = this.scriptId;
    script.src = this.scriptUrl;
    return script;
  }

  public destroy(): void {
    try {
      this.container.innerText = '';
      this._clearMapStyles();
      this._clearMapScripts();
    } catch {
    }
  }

  private _clearMapStyles(): void {
    if (this.styleSelector) {
      Array.from(this.documentRef.getNativeDocument().querySelectorAll('style'))
        .forEach((style) => {
          const isMapStyle = style.innerHTML.indexOf(this.styleSelector) === 0;
          if (isMapStyle) {
            if (style) {
              style.remove();
            }
          }
        });
    }
  }

  private _clearMapScripts(): void {
    if (this.scriptSelector) {
      Array.from(this.documentRef.getNativeDocument().querySelectorAll(this.scriptSelector))
        .forEach((script) => {
          if (script) {
            script.remove();
          }
        });
    }
  }

}

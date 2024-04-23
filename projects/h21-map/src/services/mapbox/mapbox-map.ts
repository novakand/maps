import { Injectable, NgZone } from '@angular/core';

// external libs
import { ZoomBox } from '@h21-map/leaflet-zoom-box';
import { Observable, Observer } from 'rxjs';

// enums
import { CursorType } from '../../enums/cursor-type.enum';
import { MapboxLanguageCode } from '../../enums/mapbox/mapbox-language-code.enum';

// interfaces
import { MarkerOptions } from '../../interfaces/marker-options.interface';
import { IPolylineOptions } from '../../interfaces/polyline-options.interface';

// models
import { MapboxApiConfig } from '../../models/mapbox/mapbox-api-config.model';
import { MapOptions } from '../../models/map-options.model';
import { Position } from '../../models/position.model';
import { MapboxLanguageDictionary } from '../../models/mapbox/mapbox-language.model';
import { ClientPosition } from '../../models/event-client-pixel.model';

// services
import { MapService } from '../abstract/abstract-map';
import { MapboxDataLayerService } from './mapbox-data-layer';
import { MapboxEventService } from './mapbox-event';
import { MapboxDrawingService } from './mapbox-drawing';
import { MapboxMarkerClusterService } from './mapbox-cluster';
import { MapboxSearchService } from './mapbox-search';
import { MapboxRouteService } from './mapbox-route';
import { MapboxMarkerService } from './mapbox-marker';
import { MapboxConversionsService } from './mapbox-conversions';
import { MapboxGeocodingService } from './mapbox-geocoding';
import { MapboxGeoLocationService } from './mapbox-geolocation';
import { MapboxBoundarService } from './mapbox-boundar';
import { MapboxDistanceService } from './mapbox-distance';
import { MapboxAddressService } from './mapbox-address';

declare var L;

@Injectable()
export class MapboxMapService extends MapService<L.Map, L.Marker, L.Polyline> {

  public overlayMap: L.ILayer;

  constructor(
    public apiConfig: MapboxApiConfig,
    public address: MapboxAddressService,
    public dataLayer: MapboxDataLayerService,
    public drawing: MapboxDrawingService,
    public distance: MapboxDistanceService,
    public events: MapboxEventService,
    public marker: MapboxMarkerService,
    public cluster: MapboxMarkerClusterService,
    public search: MapboxSearchService,
    public route: MapboxRouteService,
    public geocoding: MapboxGeocodingService,
    public geolocation: MapboxGeoLocationService,
    public conversions: MapboxConversionsService,
    public boundar: MapboxBoundarService,
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
    return 'script[src*=\'unpkg.com/leaflet\']';
  }

  public get scriptId(): string {
    return this.apiConfig.name;
  }

  public get scriptUrl(): string {
    return this.apiConfig.url;
  }

  public get styleSelector(): string {
    return null;
  }

  public createPolyline(polylineOptions: IPolylineOptions): Observable<any> {
    return new Observable((observer: Observer<L.Polyline>) => {
      const options = {
        opacity: polylineOptions.strokeOpacity,
        color: polylineOptions.strokeColor,
        fillOpacity: polylineOptions.fillOpacity,
        weight: polylineOptions.strokeWeight,
        smoothFactor: 0.7,
        dashArray: polylineOptions.symbol,
        lineJoin: 'round',
      };

      observer.next(new L.polyline([], options));
    });
  }

  public createMarker(markerOptions: MarkerOptions = new MarkerOptions()): Observable<any> {
    return new Observable((observer: Observer<L.Marker>) => {
      const icon = L.divIcon({
        iconSize: new L.Point(markerOptions.icon.width, markerOptions.icon.height),
        iconAnchor: markerOptions.labelContent ? new L.Point(60, 31) : new L.Point(12, 31),
        className: markerOptions.labelContent ? markerOptions.labelClass : 'leaflet-div-icon',
        html: markerOptions.labelContent ? markerOptions.labelContent : `<img src='${markerOptions.icon.url}'/>`,
      });

      const options: L.MarkerOptions = {
        icon: icon,
        zIndexOffset: markerOptions.zIndex || 99,
        riseOnHover: true,
        bubblingMouseEvents: true,
      };
      observer.next(new L.marker([markerOptions.position.latitude, markerOptions.position.longitude], options));
    });
  }

  public createMap(htmlElement: HTMLElement, mapOptions: MapOptions): Observable<boolean> {
    this.container = htmlElement;
    return new Observable((observer: Observer<boolean>) => {
      try {
        const options: L.MapOptions = {
          zoom: mapOptions.zoom,
          minZoom: mapOptions.minZoom,
          maxZoom: 19,
          maxBoundsViscosity: 1.0,
          trackResize: true,
          fadeAnimation: false,
          zoomAnimation: true,
          markerZoomAnimation: false,
          zoomControl: mapOptions.enableDefaultControl,
          doubleClickZoom: mapOptions.enableDoubleClickZoom,
          inertia: false,
          attributionControl: true,
          dragging: mapOptions.enableDraggable,
          scrollWheelZoom: mapOptions.enableScrollwheel,
          center: [mapOptions.center.latitude, mapOptions.center.longitude],
        };

        this.api = new L.map(htmlElement, options);

        L.tileLayer(
          `https://api.mapbox.com/styles/v1/${''
          }horse21/${this.getScriptName(this.apiConfig.name).getAttribute('lang')}${''
          }/tiles/{z}/{x}/{y}@2x?access_token=${this.apiConfig.key}`, {
          tileSize: 512,
          maxZoom: 19,
          zoomOffset: -1,
          attribution: `© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> ©${''
            }<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
        }).addTo(this.api);

        this._zone.run(() => this.loadMap$.next(true));
        this._zone.run(() => observer.next(true));

        L.Control.Watermark = L.Control.extend({
          onAdd: () => {
            const div = L.DomUtil.create('a');
            div.className = 'mapboxgl-ctrl-logo';
            return div;
          },
        });

        L.control.watermark = (opts) => new L.Control.Watermark(opts);
        L.control.watermark({ position: 'bottomleft' }).addTo(this.api);

        const southWest = new L.latLng(-90, -180);
        const northEast = new L.latLng(90, 180);
        const bounds = new L.latLngBounds(southWest, northEast);
        this.api.setMaxBounds(bounds);
        this.api.getContainer().style.cursor = mapOptions.defaultCursor;

      } catch {
        this._zone.run(() => observer.next(false));
      }
    });
  }

  public setDefaultCursor(cursor: CursorType): void {
    cursor === CursorType.pickUp
      || cursor === CursorType.dropDown
      || cursor === CursorType.destination ?
      this._setImgCursor(cursor) :
      this.api.getContainer().style.cursor = cursor;
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

  public setMaxZoom(zoom: number): void {
    this.api.setMaxZoom(zoom);
  }

  public getMinZoom(): number {
    return this.api.getMinZoom();
  }

  public getMaxZoom(): number {
    return this.api.getMaxZoom();
  }

  public getOverlay<E>(): E {
    return <E><unknown>this.overlayMap;
  }

  public setZoomBox(enabled): void {
  }

  public fitBounds(positions?: Position[]): void {
    try {
      if (!L) {
        return;
      }

      const bounds = new L.latLngBounds();

      this.marker.markers.forEach((value) => {
        bounds.extend(value.getLatLng());
      });

      this.route.routes.forEach((value) => {
        bounds.extend(...value.getLatLngs());
      });

      this.drawing.marker && bounds.extend(new L.LatLng(this.drawing.marker.position.latitude, this.drawing.marker.position.longitude));
      this.drawing.circle && bounds.extend(this.drawing.circle.bounds);

      if (this.drawing.area && this.drawing.area.position.length) {
        this.drawing.area.position.forEach((value: Position) => {
          bounds.extend(new L.LatLng(value.latitude, value.longitude));
        });
      }

      if (!bounds.isValid()) {
        return;
      }
      this.api.fitBounds(bounds);
    } catch { }
  }

  public setDraggable(enabled: boolean) {
    enabled ? this.api.dragging.enable() : this.api.dragging.enable();
  }

  public setScrollwheel(enabled: boolean): void {
    enabled ? this.api.scrollWheelZoom.enabled() : this.api.scrollWheelZoom.enabled();
  }

  public setDoubleClickZoom(enabled: boolean): void {
    enabled ? this.api.doubleClickZoom.enabled() : this.api.doubleClickZoom.disable();

  }

  public setClick(enabled: boolean): void {
    this.clickMap = enabled;
  }

  public setCenter(latitude: number, longitude: number, zoom: number): void {
    this.api.setView([latitude, longitude], zoom);
  }

  public setResize(): void {
    this.api.invalidateSize();
  }

  public setZoomIn(): void {
    this.api.zoomIn();
  }

  public setZoomOut(): void {
    this.api.zoomOut();
  }

  public setPanBy(clientX: number, clientY: number): void {
    clientX < 0 ?
      clientX = Math.abs(clientX)
      : clientX = 0 - clientX;
    this.api.panBy(new L.Point(clientX, 0 - clientY));
  }

  public fromLatLngToPixel(latitude: number, longitude: number): ClientPosition {
    const px = this.api.latLngToContainerPoint(new L.LatLng(latitude, longitude));
    const pixel = new ClientPosition();
    pixel.clientX = px.x;
    pixel.clientY = px.y;
    return pixel;
  }

  public loadAPI(lang): Observable<boolean> {
    const _lang = MapboxLanguageCode[lang];
    _lang ? this.apiConfig.language = MapboxLanguageCode[lang]
      : this.apiConfig.language = MapboxLanguageCode.en;

    try {
      return new Observable((observer: Observer<boolean>) => {
        if (!this.getScriptName(this.apiConfig.name)) {
          const script = this.getScript();
          script.setAttribute('lang', this.apiConfig.language);
          this.documentRef.getNativeDocument().body.appendChild(script);

          script.onload = () => {
            setTimeout(() => {
              this._zone.run(() => observer.next(true));
            }, 800);
          };
        } else {
          setTimeout(() => {
            this._zone.run(() => observer.next(true));
          }, 1000);
        }
      });
    } catch {
    }
  }

  public getLanguageDictionary(): any {
    return new MapboxLanguageDictionary().language;
  }

  public getStaticUrl(latitude: number, longitude: number, iconUrl: string): string {
    const token = 'pk.eyJ1IjoiaG9yc2UyMSIsImEiOiJjazNoZHFpb2QwYWw3M2htdTE3ejlobWdyIn0.znyyDs4gHiWL6xGqZYePkA';
    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/url-${encodeURIComponent(iconUrl)}(${[longitude, latitude]})/${''
    }${longitude},${latitude},16,0/400x400@2x?access_token=${token}`;
  }

  public destroy(): void {
    if (JSON.parse(this.containerId)) {
      super.destroy();
      this.api.stop();
      this.api.remove();
    }
    if (this.container) {
      this.container.classList.remove('leaflet-container');
      this.container.classList.remove('leaflet-touch');
      this.container.classList.remove('leaflet-fade-anim');
      this.container.innerText = '';
    }
  }

  private _setImgCursor(cursor): void {
    this.api.getContainer().style.cursor = `url(${cursor}), auto`;
  }

}


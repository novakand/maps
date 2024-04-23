import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';
import * as Overlay from '@h21-map/google-overlay';

// services
import { DataLayerService } from '../abstract/abstract-data-layer';

// directives
import { H21MapDataLayerDirective } from '../../directives/h21-map-data-layer.directive';
import { FeatureEvent } from '../../models/feature-event.model';
import { Position } from '../../models';

@Injectable()
export class GoogleDataLayerService extends DataLayerService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

    private layers: Map<H21MapDataLayerDirective, google.maps.Data> = new Map<H21MapDataLayerDirective, google.maps.Data>();

    constructor(private _zone: NgZone) {
        super();
    }

    public addDataLayer(layer?: H21MapDataLayerDirective): void {
        this._createDataLayer().subscribe((dataLayer) => {
            this.layers.set(layer, dataLayer);
            dataLayer.setMap(this.map.api);
            this.createOverlay(layer);
        });
    }

    public createOverlay(layer?: H21MapDataLayerDirective): void {
        this.layers.get(layer).set('overlay', []);
        if (!layer.geoJson) { return; }
        this._getArray(layer).subscribe((() => {
            this._addDataLayer(layer);
        }));
    }

    public updateDataLayer(layer: H21MapDataLayerDirective): void {
        this._removeFeature(layer);
        this._removeOverlay(layer);
        this.createOverlay(layer);
    }

    public removeDataLayer(layer?: H21MapDataLayerDirective): void {
        if (this.layers.get(layer)) {
            this.layers.get(layer).setMap(null);
            this.layers.delete(layer);
        }
    }

    public removeDataLayers(): void {
        this.layers.forEach((key) => {
            return this._zone.run(() => {
                key.setMap(null);
            });
        });
        this.layers.clear();
    }

    public createEvent<E>(eventName: string, layer: H21MapDataLayerDirective): Observable<E> {
        return new Observable((observer: Observer<E>) => {
            this.layers.get(layer) && this.layers.get(layer).addListener(eventName, (event: E) =>
                this._zone.run(() => observer.next(event)));
            this.layers.get(layer).get('overlay') && this.layers.get(layer).get('overlay').forEach((value) => {
                value.addListener(eventName, (event: E) => this._zone.run(() => observer.next(event)));
            });
        });

    }
    public createEventMouseOver<D>(layer: H21MapDataLayerDirective): Observable<D> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('mouseover', layer).subscribe((event: any) => {
                this._zone.run(() => observer.next(this._createEventField(event)));
                this.layers.get(layer).revertStyle();
                this._overrideStyle(layer, event);
            });
        });
    }

    public createEventMouseOut<D>(layer: H21MapDataLayerDirective): Observable<D> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('mouseout', layer).subscribe((event: any) => {
                this.layers.get(layer).revertStyle();
                this._zone.run(() => observer.next(this._createEventField(event)));
                if (event.e) {
                    event.e.target.style.zIndex = event.feature.properties.zIndex || 100;
                }
            });
        });
    }

    public createEventMouseClick<DE>(layer: H21MapDataLayerDirective): Observable<DE> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('click', layer).subscribe((event: any) => {
                observer.next(this._createEventField(event));
            });
        });
    }

    private _createDataLayer(options?: google.maps.Data.DataOptions): Observable<google.maps.Data> {
        return new Observable((observer: Observer<google.maps.Data>) => {
            observer.next(new google.maps.Data(options));
        });
    }

    private _getArray(layer?: H21MapDataLayerDirective): Observable<any> {
        return new Observable((observer) => {
            layer.geoJson.features.forEach((feature, index, object) => {
                if (!feature.properties.iconUrl) {
                    const overlay = this._createOverlay(feature);
                    this.layers.get(layer).get('overlay').push(overlay);
                }
            });
            layer.geoJson.features = layer.geoJson.features.filter((item: any) => item.properties.iconUrl !== null);
            observer.next();
            observer.complete();
        });
    }

    private _overrideStyle(layer: H21MapDataLayerDirective, event: any) {
        if (event.e) {
            event.e.target.style.zIndex = event.feature.properties.zIndexSelected;
        } else {
            const icon = event.feature.getProperty('iconUrlSelected');
            const zIndex = event.feature.getProperty('zIndexSelected');
            this.layers.get(layer).overrideStyle(event.feature, {
                icon,
                zIndex,
            });
        }
    }

    private _createOverlay(feature?: any): any {
        const _overlay = Overlay.default(google.maps);
        return new _overlay(this._createOptions(feature));
    }

    private _createOptions(feature?: any): any {
        return {
            opacity: 0,
            iconContent: feature.properties.iconContent,
            visible: false,
            feature: feature,
            shape: {},
            zIndex: feature.properties.zIndex,
            map: this.map.api,
            iconVisible: true,
            iconAnchor: new google.maps.Point(0, 30),
            iconClass: feature.properties.iconClass,
            position: new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
        };
    }

    private _addDataLayer(layer: H21MapDataLayerDirective): void {
        this.layers.get(layer).addGeoJson(layer.geoJson);
        this._addDataStyles(layer);
    }

    private _addDataStyles(layer?: H21MapDataLayerDirective): void {
        this.layers.get(layer).setStyle((feature) => {
            return ({
                icon: {
                    url: feature.getProperty('iconUrl'),
                    zIndex: feature.getProperty('zIndex'),
                },
            });
        });
    }

    private _removeFeature(layer: H21MapDataLayerDirective): void {
        const _layer = this.layers.get(layer);
        _layer.forEach((feature) => {
            _layer.remove(feature);
        });
    }

    private _removeOverlay(layer: H21MapDataLayerDirective): void {
        const _layer = this.layers.get(layer);
        _layer.get('overlay') && _layer.get('overlay').forEach((overlay) => {
            overlay.setMap(null);
        });
        this.layers.get(layer).set('overlay', null);
    }

    private _createEventField(event: any): FeatureEvent {
        const pixel = this.map.conversions.translateLatLngClientXY(event);
        return new FeatureEvent(
            new Position(event.latLng.lat(), event.latLng.lng()),
            pixel.clientX,
            pixel.clientY,
            event.feature.getProperty ? event.feature.getProperty('data') : event.feature.data || null,
            event.feature.type ? event.feature.type : 'Feature',
        );
    }

}

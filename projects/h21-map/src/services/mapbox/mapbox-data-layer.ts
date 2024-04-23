import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// services
import { DataLayerService } from '../abstract/abstract-data-layer';

// directives
import { H21MapDataLayerDirective } from '../../directives/h21-map-data-layer.directive';
import { FeatureEvent } from '../../models/feature-event.model';
import { Position } from '../../models/position.model';

@Injectable()
export class MapboxDataLayerService extends DataLayerService<L.Map, L.Marker, L.Polyline> {

    private layers: Map<H21MapDataLayerDirective, L.GeoJSON> = new Map<H21MapDataLayerDirective, L.GeoJSON>();

    constructor(private _zone: NgZone) {
        super();
    }

    public updateDataLayer(layer: H21MapDataLayerDirective): void {
        this._removeFeature(layer);
        this.createOverlay(layer);
    }

    public addDataLayer(layer?: H21MapDataLayerDirective): void {
        this._createDataLayer().subscribe((dataLayer) => {
            this.layers.set(layer, dataLayer);
            dataLayer.addTo(this.map.api);
            this.createOverlay(layer);
        });
    }

    public createOverlay(layer?: H21MapDataLayerDirective): void {
        if (!layer.geoJson) { return; }
        this.layers.get(layer).addData(layer.geoJson);
    }

    public removeDataLayer(layer?: H21MapDataLayerDirective): void {
        this.layers.get(layer).remove();
    }

    public removeDataLayers(): void {
        this.layers.forEach((key) => {
            return this._zone.run(() => {
                this.map.api.removeLayer(key);
            });
        });
        this.layers.clear();
    }

    public createEvent<E>(eventName: string, layer: H21MapDataLayerDirective): Observable<E> {
        return new Observable((observer: Observer<any>) => {
            this.layers.get(layer) && this.layers.get(layer).addEventListener(eventName, (event) => {
                this._zone.run(() => observer.next(event));
            });
        });
    }

    public createEventMouseOver<D>(layer: H21MapDataLayerDirective): Observable<D> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('mouseover', layer).subscribe((event: any) => {
                this._zone.run(() => observer.next(this._createEventField(event)));
            });
        });
    }

    public createEventMouseOut<D>(layer: H21MapDataLayerDirective): Observable<D> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('mouseout', layer).subscribe((event: any) => {
                this._zone.run(() => observer.next(event));
            });
        });
    }

    public createEventMouseClick<DE>(layer: H21MapDataLayerDirective): Observable<DE> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('click', layer).subscribe((event: any) => {
                this._zone.run(() => observer.next(this._createEventField(event)));
            });
        });
    }

    private _createDataLayer(options?: any): Observable<L.GeoJSON> {
        return new Observable((observer: Observer<L.GeoJSON>) => {
            observer.next(new L.GeoJSON(null, {
                pointToLayer: (feature, latlng) => {
                    return this._createOverlay(feature, latlng);
                },
                style: (feature) => {
                    return this._addDataStyles(feature);
                },

                onEachFeature: (feature, layer) => {
                    this._overrideStyle(feature, layer);
                },

                filter: (feature: L.GeoJSON.Feature) => {
                    feature.type = 'Feature';
                    return true;
                },

            }));
        });
    }

    private _addDataStyles(feature: any, isSelected?: boolean): any {
        return {
            zIndexOffset: isSelected ?
                feature.properties.zIndexSelected
                : feature.properties.zIndex,
            riseOnHover: true,
            bubblingMouseEvents: true,
        };
    }

    private _createOverlay(feature: L.GeoJSON.Feature, LatLng?: L.LatLng): any {
        return L.marker(LatLng, { icon: this._createOptions(feature) });
    }

    private _createOptions(feature: any, isSelected?: boolean): any {
        let iconSelected = feature.properties.iconClassSelected;
        iconSelected ? iconSelected = feature.properties.iconClassSelected
            : iconSelected = feature.properties.iconClass;
        return L.divIcon({
            iconSize: feature.properties.iconSize ? new L.Point(feature.properties.iconSize[0], feature.properties.iconSize[1])
                : new L.Point(0, 0),
            iconAnchor: feature.properties.iconUrl ? new L.Point(12, 31) : new L.Point(60, 31),
            className: feature.properties.iconUrl ? 'leaflet-div-icon' : (isSelected && !iconSelected) ? iconSelected
                : feature.properties.iconClass,
            html: feature.properties.iconUrl ? `<img src='${isSelected ? feature.properties.iconUrlSelected
                : feature.properties.iconUrl}'/>` : feature.properties.iconContent,
        });
    }

    private _removeFeature(layer: H21MapDataLayerDirective): void {
        const _layer = this.layers.get(layer);
        _layer.eachLayer(() => {
            _layer.remove();
        });
    }

    private _createEventField(event: any): FeatureEvent {
        !event.sourceTarget.feature.properties.iconUrl && this._eventPosition(event);
        const pixel = this.map.conversions.translateLatLngClientXY(event);
        const latlng = event.latlng;
        return new FeatureEvent(
            new Position(latlng.lat, latlng.lng),
            pixel.clientX,
            pixel.clientY,
            event.sourceTarget.feature.properties.data || null,
            event.sourceTarget.feature.number ? 'Cluster' : 'Feature',
        );
    }

    private _overrideStyle(feature, layer) {
        layer.on('mouseover', (e) => {
            layer.setIcon(this._createOptions(feature, true));
            layer.setZIndexOffset(feature.properties.zIndexSelected || 1000);
        });
        layer.on('mouseout', (e) => {
            layer.setIcon(this._createOptions(feature));
            layer.setZIndexOffset(feature.properties.zIndex || 100);
        });
    }

    private _eventPosition(event: any) {
        const size = event.sourceTarget._icon;
        event.offsetX = size.offsetWidth / 2 - 60;
        event.offsetY = size.offsetHeight;
        return event;
    }

}

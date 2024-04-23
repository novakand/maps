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
export class YandexDataLayerService extends DataLayerService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

    private layers: Map<H21MapDataLayerDirective, ymaps.ObjectManager> = new Map<H21MapDataLayerDirective, ymaps.ObjectManager>();

    constructor(private _zone: NgZone) {
        super();
    }

    public updateDataLayer(layer: H21MapDataLayerDirective): void {
        this.removeDataLayer(layer);
        this.createOverlay(layer);
    }

    public addDataLayer(layer?: H21MapDataLayerDirective): void {
        this._createDataLayer().subscribe((dataLayer) => {
            this.layers.set(layer, dataLayer);
            this.map.api.geoObjects.add(dataLayer);
            this.createOverlay(layer);
        });

    }

    public createOverlay(layer?: H21MapDataLayerDirective): void {
        if (!layer.geoJson) { return; }
        this._getArray(layer).subscribe((() => {
            this._addDataLayer(layer);
        }));
    }

    public removeDataLayer(layer?: H21MapDataLayerDirective): void {
        this.layers.get(layer).removeAll();
    }

    public removeDataLayers(): void {
        this.layers.forEach((key) => {
            key.removeAll();
        });
        this.layers.clear();
    }
    public createEvent<E>(eventName: string, layer: H21MapDataLayerDirective): Observable<E> {
        return new Observable((observer: Observer<any>) => {
            this.layers.get(layer).objects.events.add(eventName, (event) => this._zone.run(() => observer.next(event)));
            this.layers.get(layer).clusters.events.add(eventName, (event) => this._zone.run(() => observer.next(event)));
        });
    }
    public createEventMouseOver<D>(layer: H21MapDataLayerDirective): Observable<D> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('mouseenter', layer).subscribe((event: any) => {
                event.isSelected = true;
                this._overrideStyle(layer, event);
                this._zone.run(() => observer.next((this._createEventField(layer, event))));
            });
        });
    }

    public createEventMouseOut<D>(layer: H21MapDataLayerDirective): Observable<D> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('mouseleave', layer).subscribe((event: any) => {
                event.isSelected = false;
                this._overrideStyle(layer, event);
                this._zone.run(() => observer.next((null)));
            });
        });
    }

    public createEventMouseClick<DE>(layer: H21MapDataLayerDirective): Observable<DE> {
        return new Observable((observer: Observer<any>) => {
            this.createEvent('click', layer).subscribe((event: any) => {
                this._zone.run(() => observer.next((this._createEventField(layer, event))));
            });
        });
    }

    private _createDataLayer(options?: any): Observable<any> {
        return new Observable((observer: Observer<any>) => {
            observer.next(new ymaps.ObjectManager(options));
        });
    }

    private _createOverlay(layer: H21MapDataLayerDirective): any {
        this.layers.get(layer).objects.each((feature, i) => {
            const typeFeature = feature.type;
            typeFeature === 'Cluster' ?
                this.layers.get(layer).clusters.setClusterOptions(feature.id, this._createOptionsCluster(feature))
                : this.layers.get(layer).objects.setObjectOptions(feature.id, this._createOptionsFeature(feature));
        });
    }

    private _createTemplateFeature(feature: any): string {
        return `<div class="${feature.properties.iconClass}">${feature.properties.iconContent}</div>`;
    }

    private _createTemplateCluster(feature: any): string {
        return `<div class="${feature.properties.iconClass}">${feature.properties.iconContent}</div>`;
    }

    private _createOptionsCluster(feature: any): any {
        return {
            clusterIconShape: {
                type: 'Circle',
               // coordinates: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
                coordinates: [0, 0],
                radius: 25,
            },
            clusterIconLayout: ymaps.templateLayoutFactory.createClass(this._createTemplateCluster(feature)),
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            zIndex: feature.properties.zIndex,
            groupByCoordinates: false,
            hasBalloon: false,
        };
    }

    private _createOptionsFeature(feature: any, isSelected?: boolean): any {
        return {
            iconLayout: feature.properties.iconUrl ? 'default#image' : 'default#imageWithContent',
            iconImageSize: feature.properties.iconUrl ? [feature.properties.iconSize[0], feature.properties.iconSize[1]] :
                [81, 30],
            iconImageOffset: feature.properties.iconUrl ? [-7, -10] : [-40, -20],
            iconContentOffset: [40, 0],
            syncOverlayInit: true,
            iconImageHref: feature.properties.iconUrl ? feature.properties.iconUrl : '/',
            zIndex: feature.properties.zIndex,
            zIndexHover: feature.properties.zIndexSelected,
            showHintOnHover: false,
            hasBalloon: false,
            hasHint: false,
            iconContentLayout: feature.properties.iconUrl ? null
                : ymaps.templateLayoutFactory.createClass(this._createTemplateFeature(feature)),
        };
    }

    private _addDataLayer(layer: H21MapDataLayerDirective): void {
        this.layers.get(layer).add(layer.geoJson);
        this._createOverlay(layer);
    }

    private _getArray(layer?: H21MapDataLayerDirective): Observable<any> {
        return new Observable((observer) => {
            layer.geoJson.features.forEach((feature) => {
                const _geometry = feature.geometry.coordinates;
                feature.geometry.coordinates = [_geometry[1], _geometry[0]];
            });
            observer.next();
            observer.complete();
        });
    }

    private _overrideStyle(layer: H21MapDataLayerDirective, event: any) {
        const _objectId = event.get('objectId');
        const _layer = this.layers.get(layer);
        const _feature = _layer.objects.getById(_objectId);
        let _icon = _feature.properties.iconUrl;
        event.isSelected ? _icon = _feature.properties.iconUrlSelected
            : _icon = _feature.properties.iconUrl;

        this.layers.get(layer).objects.setObjectOptions(_objectId, {
            iconImageHref: _icon ? _icon : '/',
        });
    }

    private _createEventField(layer: H21MapDataLayerDirective, event: any): FeatureEvent {
        const _objectId = event.get('objectId');
        const _layer = this.layers.get(layer);
        const _feature = _layer.objects.getById(_objectId);
        event.geometry = _feature.geometry.coordinates;
        this._eventPositionIcon(event, _feature);
        const pixel = this.map.conversions.translateLatLngClientXY(event);
        return new FeatureEvent(
            new Position(_feature.geometry.coordinates[1], _feature.geometry.coordinates[0]),
            pixel.clientX,
            pixel.clientY,
            _feature.properties.data || null,
            _feature.type,
        );
    }

    private _eventPositionIcon(event: any, feature) {
        feature.properties.iconUrl ? event.offsetX = 5 : event.offsetX = 0;
        feature.properties.iconUrl ? event.offsetY = 15 : event.offsetY = 10;
        return event;
    }

}

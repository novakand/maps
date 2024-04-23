import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// services
import { DataLayerService } from '../abstract/abstract-data-layer';

// directives
import { H21MapDataLayerDirective } from '../../directives/h21-map-data-layer.directive';

@Injectable()
export class BaiduDataLayerService extends DataLayerService<BMap.Map, BMap.Marker, BMap.Polyline> {

    public updateDataLayer(layer: H21MapDataLayerDirective): void {
    }

    public addDataLayer(layer?: H21MapDataLayerDirective): void {

    }
    public removeDataLayer(layer?: H21MapDataLayerDirective): void {

    }
    public removeDataLayers(): void {

    }
    public createEvent<E>(eventName: string, layer: H21MapDataLayerDirective): Observable<E> {
        return null;
    }
    public createEventMouseOver<D>(layer: H21MapDataLayerDirective): Observable<D> {
        return null;
    }
    public createEventMouseOut<D>(layer: H21MapDataLayerDirective): Observable<D> {
        return null;
    }
    public createEventMouseClick<DE>(layer: H21MapDataLayerDirective): Observable<DE> {
        return null;
    }


}

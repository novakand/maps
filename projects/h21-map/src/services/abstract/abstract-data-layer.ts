import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// services
import { MapService } from './abstract-map';

// directives
import { H21MapDataLayerDirective } from '../../directives/h21-map-data-layer.directive';

@Injectable()
export abstract class DataLayerService<T, U, N> {

    public map: MapService<T, U, N>;

    public initMap(map: MapService<T, U, N>): void {
        this.map = map;
    }

    public abstract addDataLayer(layer?: H21MapDataLayerDirective, geoJson?: any): void;

    public abstract removeDataLayer(layer?: H21MapDataLayerDirective): void;

    public abstract removeDataLayers(): void;

    public abstract createEvent<E>(eventName: string, layer: H21MapDataLayerDirective): Observable<E>;

    public abstract createEventMouseOver<D>(layer: H21MapDataLayerDirective): Observable<D>;

    public abstract createEventMouseOut<D>(layer: H21MapDataLayerDirective): Observable<D>;

    public abstract createEventMouseClick<DE>(layer: H21MapDataLayerDirective): Observable<DE>;

    public abstract updateDataLayer<DE>(layer: H21MapDataLayerDirective): void;

}

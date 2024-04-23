import { Position } from 'projects/h21-map/src/models';

export class  SearchMinimalRequest {

    public filter: SearchMin;
    public take?: number;

}

export class SearchMin {

    public coordinateContains: Position;
    public distance: number;
    public distanceUnit?: string;
    public nameContains?: string;
    public languageId?: number;
    public id: number;

}

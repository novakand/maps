import { Position } from './position.model';

export class FeatureEvent {

    public data: any;
    public clientX: number;
    public clientY: number;
    public position: Position;
    public type: string;

    constructor(position: Position, clientX: number, clientY: number, data: any, type: string) {
        this.clientX = clientX;
        this.clientY = clientY;
        this.data = data;
        this.position = position;
        this.type = type;
    }

}

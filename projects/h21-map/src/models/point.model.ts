import { IImages } from '../interfaces/icon.interface';
import { PointAddress } from './point-address.model';
import { Position } from './position.model';

export class Point {

  public name: string;
  public photos: IImages[];
  public address: PointAddress;
  public position: Position;
  public iata: string;
  public id: string;
  public googlePlaceId: string;
  public placeId: string;
  public type: string;
  public title: string;
  public subtype: string;
  public source: string;
  public provider: string;

  constructor(obj?: Partial<Point>) {
    Object.assign(this, obj);
  }

}

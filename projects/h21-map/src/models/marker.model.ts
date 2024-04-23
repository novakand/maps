import { TypePoint } from '../enums/point-type.enum';
import { IImages } from '../interfaces/icon.interface';
import { PointAddress } from './point-address.model';

export class DrawingMarker {

  public latitude: number;
  public longitude: number;
  public fitBounds?: boolean;
  public address?: PointAddress;
  public iconUrl?: string;
  public photos?: IImages[];
  public title?: string;
  public inCluster?: boolean;
  public iconWidth?: number;
  public iconHeight?: number;
  public iconZIndex?: number;
  public typePoint?: TypePoint;
  public subType: string;

  constructor(obj: Partial<DrawingMarker>) {
    Object.assign(this, obj);
  }

}

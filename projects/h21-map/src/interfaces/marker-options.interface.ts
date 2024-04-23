import { Position } from '../models/position.model';
import { IImages } from './icon.interface';

export class MarkerOptions {

  public icon: IImages;
  public labelContent: string;
  public position: Position;
  public zIndex: number;
  public labelClass: string;

}


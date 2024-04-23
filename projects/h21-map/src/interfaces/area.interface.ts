import { Position } from '../models/position.model';

export interface IArea {
  positions: Position[];
  fitBounds?: boolean;
}

import { TypePoint } from '../enums/point-type.enum';

export interface IMarker {
  latitude: number;
  id?: string;
  longitude: number;
  fitBounds?: boolean;
  address?: string;
  iconUrl?: string;
  title?: string;
  isCluster?: boolean;
  iconWidth?: number;
  iconHeight?: number;
  iconZIndex?: number;
  typePoint?: TypePoint;
}

import { TypePoint } from '../enums/point-type.enum';
import { AnimateType } from 'projects/h21-map/src/enums/animate.type';
import { SubTypePoint } from '../enums/sub-type-point.enums';
import { PlaceSubType } from 'projects/h21-map/src/enums';


export interface IMarker {

   latitude: number;
   longitude: number;
   fitBounds?: boolean;
   animate?: AnimateType;
   address?: string;
   iconUrl?: string;
   title?: string;
   id?: number;
   isCluster?: boolean;
   iconWidth?: number;
   iconHeight?: number;
   labelClass?: string;
   labelContent?: string;
   isLabelActive?: boolean;
   iconZIndex?: number;
   typePoint?: TypePoint;
   subTypePoint?: SubTypePoint;
   subType?: PlaceSubType;

}

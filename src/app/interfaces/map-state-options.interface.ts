
import { ICircle } from './circle.interface';
import { IMarker } from './marker.interface';

export interface IStateMapOptions {

     latitude?: number;
     longitude?: number;
     zoom?: number;
     markers?: IMarker[];
     circle?: ICircle;
     destinationMarker?: IMarker;
     area?: Position[];
     minZoom?: number;
     maxZoom?: number;
     enableClick?: boolean;
     enableDoubleClickZoom?: boolean;
     enableDraggable?: boolean;
     enableDefaultControl?: boolean;
     defaultCursor?: string;
     enableScrollwheel?: boolean;
     provider?: string;
     preloaderIsOpen?: boolean;

  }

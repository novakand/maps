import { LanguageCode } from 'projects/h21-map/src/enums/language-service.enum';


export interface IMapOptions {

   latitude: number;
   longitude: number;
   language?: LanguageCode;
   zoom: number;
   minZoom: number;
   maxZoom: number;
   enableClick?: boolean;
   enableDoubleClickZoom?: boolean;
   enableDraggable?: boolean;
   defaultCursor?: string;
   provider?: string;
   preloaderIsOpen: boolean;
   apiKey?: string;

}

export interface IEventMouse extends MouseEvent {
  latLng: google.maps.LatLng;
  latlng: L.LatLng;
  placeId: string;
  point: BMap.Point;
  offsetX: number;
  offsetY: number;
  ma: any;
  wa: any;
  _cache: any;
  pixel: any;
  get: any;
  originalEvent: any;
  currentTarget: any;
  sourceTarget: any;
  clientX: number;
  clientY: number;
  geometry: any;

  stop(): void;

  stopPropagation(): void;
}


import { IMapEvents } from '../../interfaces/map-event.interface';

export const GoogleMapEvents: IMapEvents = {
  idle: 'idle',
  click: 'click',
  dblclick: 'dblclick',
  rightclick: 'rightclick',
  ready: 'google-map-ready',
  zoom_changed: 'zoom_changed',
  center_changed: 'center_changed',
  tilesloaded: 'tilesloaded',
  resize: 'resize',
  boundschanged: 'bounds_changed',
  centerchanged: 'center_changed',
  mouseover: 'mouseover',
  mousedown: 'mousedown',
  mouseout: 'mouseout',
  mousemove: 'mousemove',
  mouseup: 'mouseup',
  drag: 'drag',
  dragstart: 'dragstart',
  infowindowclose: 'closeclick',
};


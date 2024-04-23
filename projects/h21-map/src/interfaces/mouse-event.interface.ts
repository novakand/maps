export interface IMouseEvent {
  click: string;
  dblclick: string;
  rightclick: string;
  resize: string;
  boundschanged: string;
  centerchanged: string;
  zoomchanged: string;
  mouseover: string;
  mouseout: string;
  mousemove: string;
  [key: string]: string;
}

export enum EventType {
  click = 'click',
  drawMode = 'draw:mode',
  rightClick = 'rightclick',
  dblClick = 'dblclick',
  drag = 'drag',
  dragEnd = 'dragend',
  mouseMove = 'mousemove',
  mouseOver = 'mouseover',
  mouseOut = 'mouseout',
  mouseDown = 'mousedown',
  mouseUp = 'mouseup',
  projectionChanged = 'projection_changed',
  zoomStart = 'zoomstart',
  zoomChanged = 'zoom_changed',
  zoomEnd = 'zoomend',
  headingChanged = 'heading_changed',
  idle = 'idle',
  tilesLoaded = 'tilesloaded',
  centerChanged = 'center_changed',
  boundsChanged = 'bounds_changed',
  radiusChanged = 'radius_changed',
  resize = 'resize',
  lineUpdate = 'lineupdate',
  mouseEnter = 'mouseenter',
  mouseLeave = 'mouseleave',
  drawMarkerCreate = 'draw:marker_create',
  drawMarkerRemove = 'draw:marker_remove',
  drawMarkerMouseOut = 'draw:marker_mouseout',
  drawMarkerMouseOver = 'draw:marker_mouseover',
  drawMarkerClick = 'draw:marker_click',
  drawCircleRadiusMax = 'draw:circle_radius_max',
  drawCircleRemove = 'draw:circle_remove',
  drawCircleCreate = 'draw:circle_create',
  drawCircleCentreChange = 'draw:circle_centre_change',
  drawCircleRadiusComplete = 'draw:circle_radius_complete',
  drawCircleRadiusChange = 'draw:circle_radius_change',
  drawCircleCentreComplete = 'draw:circle_center_complete',
  drawAreaCreate = 'draw:area_create',
  drawAreaRemove = 'draw:area_remove',
  drawAreaDraw = 'draw:area_draw',
  drawZoomChangeMap = 'draw:zoom_map',
}

import { DrawingModes } from '.././enums/drawing-mode.enum';

export interface IDrawingOptions {
  areaFitBounds?: boolean;
  areaCoordinates?: any[];
  circleRadius?: number;
  circleMaxRadius?: number;
  circleLatitude?: number;
  circleLongitude?: number;
  circleFitBounds?: boolean;
  markerLatitude?: number;
  markerLongitude?: number;
  markerFitBounds?: boolean;
  markerIconUrl?: string;
  markerIconWidth?: number;
  markerIconHeight?: number;
  drawMode: DrawingModes;
  isRedraw?: boolean;
  isDraw?: boolean;
}

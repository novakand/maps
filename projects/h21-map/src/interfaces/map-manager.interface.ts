import { MapType } from '../enums/map-type.enum';

export interface IMapManager {
  register(type: MapType, container: HTMLElement): void;

  load(container: HTMLElement): void;

  destroy(): void;

  getActiveMap(): any;
}

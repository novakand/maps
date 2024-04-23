import { MapService } from '../services/abstract/abstract-map';

export interface IInitMap<T, U, N> {
  map: MapService<T, U, N>;

  initMap(map: MapService<T, U, N>): void;
}

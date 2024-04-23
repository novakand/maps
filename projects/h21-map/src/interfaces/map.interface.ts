import { MapService } from '../services/abstract/abstract-map';
import { IApiConfig } from './api-settings.interface';

export interface IMap<T, U, N> {
  source: IApiConfig;
  instance: MapService<T, U, N>;
}

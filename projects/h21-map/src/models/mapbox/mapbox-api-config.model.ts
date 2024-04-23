import { IApiConfig } from '../../interfaces/api-settings.interface';

export class MapboxApiConfig implements IApiConfig {

  public name: string;
  public url: string;
  public key: string;
  public language: string;
  public version: string;
  public callback: string;
  public handlerError: string;

  constructor() {
    this.key = 'pk.eyJ1IjoiaG9yc2UyMSIsImEiOiJjazNoZHFpb2QwYWw3M2htdTE3ejlobWdyIn0.znyyDs4gHiWL6xGqZYePkA';
    this.url = 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js';
    this.language = 'en';
    this.version = '';
    this.callback = '';
    this.name = 'mapboxScript';
    this.handlerError = '';
  }

}

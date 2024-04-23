import { IApiConfig } from '../../interfaces/api-settings.interface';

export class YandexApiConfig implements IApiConfig {

  public name: string;
  public url: string;
  public key: string;
  public language: string;
  public version: string;
  public callback: string;
  public handlerError: string;

  constructor() {
    this.key = 'ce3a8ec4-b385-4c3c-9846-297b6581f5a6';
    this.name = 'ymapsScript';
    this.url = 'https://api-maps.yandex.ru';
    this.language = 'en_US';
    this.version = '2.1.72';
    this.callback = 'APILoadedYmaps';
    this.handlerError = '';
  }

}

import { LanguageCode } from '../../enums/language-service.enum';
import { IApiConfig } from '../../interfaces/api-settings.interface';

export class GoogleApiConfig implements IApiConfig {

  public name: string;
  public url: string;
  public key: string;
  public language: LanguageCode;
  public version: string;
  public callback: string;
  public handlerError: string;

  constructor() {
    this.key = 'AIzaSyBVatgG_Di0Y8-yNMFDvczuyAGzIMcN0RU';
    this.url = 'https://maps.googleapis.com/maps/api/js?libraries=places,geometry';
    this.language = LanguageCode.en;
    this.name = 'googleScript';
    this.version = '3.37';
    this.callback = 'googleAPILoaded';
    this.handlerError = 'gm_authFailure';
  }

}

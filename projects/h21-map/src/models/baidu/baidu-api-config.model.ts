import { IApiConfig } from '../../interfaces/api-settings.interface';

export class BaiduApiConfig implements IApiConfig {

  public name: string;
  public url: string;
  public key: string;
  public language: string;
  public version: string;
  public callback: string;
  public handlerError: string;

  constructor() {
    this.key = 'PL4BDlBQfMqsq4Of6TpEsLm1Lc9743aA';
    this.url = 'https://api.map.baidu.com/api';
    this.language = 'ru_RU';
    this.version = '3.0';
    this.name = 'baiduScript';
    this.callback = 'APILoaded';
    this.handlerError = '';
  }

}


import { MapType } from '.././enums/map-type.enum';

export class ProviderCheckbox {

  public list = [
    {
      name: MapType.google,
      isChecked: false,
      isShow: true,
    },
    {
      name: MapType.mapbox,
      isChecked: false,
      isShow: true,
    },
    {
      name: MapType.yandex,
      isChecked: false,
      isShow: true,
    },
    {
      name: MapType.baidu,
      isChecked: false,
      isShow: false,
    },
  ];

}

export class MapSizeContainer {

  public width: number;
  public height: number;

  constructor(obj: Partial<MapSizeContainer>) {
    Object.assign(this, obj);
  }

}

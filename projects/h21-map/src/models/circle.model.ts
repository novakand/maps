export class Circle {

  public latitude: number;
  public longitude: number;
  public radius: number;
  public fitBounds?: boolean;

  constructor(obj: Partial<Circle>) {
    Object.assign(this, obj);
  }

}

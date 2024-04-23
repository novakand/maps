import { CircleEvent } from './circle-event.model';
import { MarkerEvent } from './marker-event.model';
import { AreaEvent } from './area-event.model';

export class DrawingSaveOptions {

  public circle: CircleEvent;
  public marker: MarkerEvent;
  public area: AreaEvent;

  constructor(obj: Partial<DrawingSaveOptions>) {
    Object.assign(this, obj);
  }

}

import { ChangeDetectionStrategy, Component, Injectable, Input, Output, ViewEncapsulation } from '@angular/core';

// external libs
import { Subject } from 'rxjs';

// enums
import { TypePointLegends } from '../../enums/point-type-legends.enum';

@Component({
  selector: 'h21-map-legends-control',
  templateUrl: './h21-map-legends-control.component.html',
  styleUrls: ['./h21-map-legends-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Injectable()
export class H21MapLegendsControlComponent {

  @Input() public isShowLegendControl = true;
  @Input() public isDisableLegend = true;
  @Input() public isCheckedLegend = true;
  @Input() public typePoint = TypePointLegends;

  @Output() public changeLegend: Subject<any> = new Subject<any>();

  public keys = Object.keys;

  public setFilter(type, isChecked) {
    const filter = {
      type,
      isChecked,
    };
    this.changeLegend.next(filter);
  }

  public trackByFn(index: number): number {
    return index;
  }

}

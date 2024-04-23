import { Component, Input, Output, ViewEncapsulation } from '@angular/core';

// external libs
import { Subject } from 'rxjs';

@Component({
  selector: 'h21-map-settings-control',
  templateUrl: './h21-map-settings-control.component.html',
  styleUrls: ['./h21-map-settings-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapSettingsControlComponent {

  @Input() public isShowSettingsControl = false;
  @Input() public isDisableSettingsControl = false;
  @Input() public isResetSettingsControl = true;
  @Input() public tooltipSettings = 'Open panel settings';

  @Output() public changeSettings: Subject<boolean> = new Subject<boolean>();

  public onChangeSettings(): void {
    this.changeSettings.next();
  }

}

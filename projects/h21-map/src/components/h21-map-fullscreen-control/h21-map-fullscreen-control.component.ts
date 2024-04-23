import { Component, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';

// external libs
import { Subject } from 'rxjs';

// enums
import { DocumentElement } from '../../enums/document-element';

// services
import { MapManager } from '../../manager/map-manager';

@Component({
  selector: 'h21-map-fullscreen-control',
  templateUrl: './h21-map-fullscreen-control.component.html',
  styleUrls: ['./h21-map-fullscreen-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapFullscreenControlComponent {

  @Input() public isShowFullscreenControl = true;
  @Input() public isDisabledFullscreenControl = false;
  @Input() public isShowFullscreen = true;
  @Input() public isShowFullscreenExit = false;
  @Input() public isShowFitBounds = true;
  @Input() public isDisabledFitbounds = false;
  @Input() public isDisabledFullscreen = false;
  @Input() public isDisabledFullscreenExit = false;
  @Input() public isResetFullscreenControl = true;
  @Input() public tooltipFullscreen = 'Enable full-screen mode';
  @Input() public tooltipFullscreenExit = 'Turn off full screen mode';
  @Input() public tooltipFitBounds = 'Set fit bounds';

  @Output() public changeFitBounds$: Subject<boolean> = new Subject<boolean>();
  @Output() public changeFullscreen$: Subject<boolean> = new Subject<boolean>();

  constructor(private _manager: MapManager) {
  }

  @HostListener('document:fullscreenchange')
  public onFullscreen() {
    if (document[DocumentElement.fullscreenElement]) {
      this.isShowFullscreen = false;
      this.isShowFullscreenExit = true;
      this.changeFullscreen$.next(true);
    } else {
      this.isShowFullscreen = true;
      this.isShowFullscreenExit = false;
      this.changeFullscreen$.next(false);
    }
  }

  public onChangeFullscreen(enabled: boolean): void {
    this._manager.getMap().setFullscreen(enabled);
  }

  public onChangeFitbounds(): void {
    this._manager.getMap().fitBounds();
    this.changeFitBounds$.next(true);
  }

}

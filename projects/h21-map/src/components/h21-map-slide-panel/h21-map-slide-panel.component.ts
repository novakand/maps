import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewEncapsulation,
  ViewRef
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

// enums
import { SidePanelType } from '../../enums/side-panel.type.enums';

@Component({
  selector: 'h21-map-slide-panel',
  templateUrl: './h21-map-slide-panel.component.html',
  styleUrls: ['./h21-map-slide-panel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('in', style({
        transform: 'translate3d(0,0,0)',
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)',
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class H21MapSlidePanelComponent {

  @Input() public sidePanel = SidePanelType.out;

  constructor(
    private eRef: ElementRef,
    private _renderer: Renderer2,
    private _cdr: ChangeDetectorRef,
  ) {
    this._onClickListener();
  }

  public close(): void {
    this.sidePanel = SidePanelType.out;
    this._cdr.detectChanges();
  }

  private _onClickListener(): void {
    this._renderer.listen('window', 'click', () => {
      const ids = ['map-settings-toggle-button', 'map-settings-toggle-button-button',  'map-settings-toggle-icon'];
      if (!this.eRef.nativeElement.contains(event.target) && this.sidePanel === SidePanelType.in) {
        this.sidePanel = SidePanelType.out;
        !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
      } else if ((ids.includes((<any>event.target).id) || this._checkChildren(event, ids)) && this.sidePanel === SidePanelType.out) {
        this.sidePanel = SidePanelType.in;
        !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
      }
    });
  }

  private _checkChildren(event: any, ids: string[]): boolean {
    return event.target.children && !![ ...event.target.children ].find((item) => ids.includes(item.id));
  }

}

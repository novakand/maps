import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'h21-map-poi-toggle-control',
  templateUrl: './h21-map-poi-toggle-control.component.html',
  styleUrls: ['./h21-map-poi-toggle-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Injectable()
export class H21MapPoiToggleControlComponent {

  @Input() public disabled = false;
  @Input() public checked = false;

  @Output() public change = new EventEmitter<boolean>();

  public get tooltip(): string {
    return this.checked
      ? 'Hide POI'
      : 'Show POI';
  }

  public toggle(): void {
    this.checked = !this.checked;
    this.change.emit(this.checked);
  }

}

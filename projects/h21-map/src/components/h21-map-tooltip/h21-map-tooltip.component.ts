import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChange,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

// external libs
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// enums
import { EventType } from '../../enums/event-type.enum';

// services
import { MapManager } from '../../manager/map-manager';

@Component({
  selector: 'h21-map-tooltip',
  templateUrl: './h21-map-tooltip.component.html',
  styleUrls: ['./h21-map-tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapTooltipComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public isShow: boolean;
  @Input() public clientX: number;
  @Input() public clientY: number;
  @Input() public zIndex = 999;

  @ViewChild('tooltipComponent') private _tooltip: ElementRef;

  private _destroy$ = new Subject<boolean>();

  private _mapContainer: HTMLElement;

  constructor(
    private _renderer: Renderer2,
    private _manager: MapManager) { }

  public ngOnInit(): void { this.onInit(); }

  public onInit() {
    this._manager.getMap().loadMap$
      .pipe(
        filter(Boolean),
        takeUntil(this._destroy$),
      )
      .subscribe({
        next: () => { this._initService(); },
      });
  }

  public ngOnDestroy(): void { this.onDestroy(); }

  public onDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public ngOnChanges(changes: { [key: string]: SimpleChange }): void {

    if (!this._tooltip) { return; }

    if (changes.clientY || changes.clientX) {
      this._setPosition();
    }
    if ('isShow' in changes && this.isShow) {
      this._open();

    } else if ('isShow' in changes && !this.isShow) {
      this._close();
    }
    changes.zIndex && this._setZIndex();
  }

  private _initService(): void {
    this._setContainer();
    this._addEventListener();
  }

  private _setPosition(): void {
    this._renderer.setStyle(this._tooltip.nativeElement, 'top', `${this.clientY}px`);
    this._renderer.setStyle(this._tooltip.nativeElement, 'left', `${this.clientX}px`);
    this._renderer.setStyle(this._tooltip.nativeElement, 'position', 'absolute');
  }

  private _setZIndex(): void {
    this._renderer.setStyle(this._tooltip.nativeElement, 'z-index', this.zIndex);
  }

  private _open(): void {
    this.isShow = true;
    this._mapContainer.appendChild(this._tooltip.nativeElement);
  }

  private _close(): void { this.isShow = false; }

  private _setContainer(): void {
    if (!this._mapContainer) { return; }
    this._mapContainer = this._manager.getMap().container;
    this._mapContainer.appendChild(this._tooltip.nativeElement);
  }

  private _addEventListener(): void {
    this._manager.getMap().drawing.createEvent(EventType.drawCircleRadiusMax)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.isShow = false;
        },
      });
  }

}

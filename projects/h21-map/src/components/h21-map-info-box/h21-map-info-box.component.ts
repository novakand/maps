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
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// enums
import { EventType } from '../../enums/event-type.enum';

// models
import { MapSizeContainer } from '../../models/map-size-container.model';

// services
import { MapManager } from '../../manager/map-manager';

@Component({
  selector: 'h21-map-info-box',
  templateUrl: './h21-map-info-box.component.html',
  styleUrls: ['./h21-map-info-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapInfoBoxComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public isShow = false;
  @Input() public clientX: number;
  @Input() public clientY: number;
  @Input() public offsetX = 0;
  @Input() public offsetY = 0;
  @Input() public zIndex = 999;
  @Input() public offsetPositionY = -42;
  @Input() public offsetPositionX = 0;

  private _infoBoxAddService: boolean;
  private _mapContainer: HTMLElement;
  private _destroy$ = new Subject<boolean>();

  constructor(
    private _renderer: Renderer2,
    private _manager: MapManager,
    @ViewChild('infoBoxContent') private _infoBox: ElementRef,
  ) { }

  public ngOnInit(): void { this.onInit(); }

  public onInit(): void {
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
    this._infoBoxAddService = false;
  }

  public ngOnChanges(changes: { [key: string]: SimpleChange }): void {
    if (!this._manager.getMap() || !this._infoBox || !this.clientY || !this.clientX) { return; }
    if ('isShow' in changes && this.isShow) {
      this._open();

    } else if ('isShow' in changes && !this.isShow) { this._close(); }

    changes.zIndex && this._setZIndex();
  }

  private _initService(): void {
    if (!this._infoBoxAddService) {
      this._mapContainer = this._manager.getMap().container;
      this._infoBoxAddService = true;
      this._addEventListener();
    }
  }

  private _addEventListener(): void {
    this._manager.getMap().events.createEventZoomChange()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.isShow = false;
      });

    this._manager.getMap().events.createEventBoundsChange()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.isShow = false;
      });

    this._manager.getMap().events.createEventCenterChange()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.isShow = false;
      });

    this._manager.getMap().events.createEvent(EventType.mouseOver)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.isShow = false;
      });
  }

  private _getInfoBoxXOffset(): number {
    const offsetX = 340;
    const yCenter = this._getInfoBoxYOffset() === -20;

    return !yCenter
      ? 0
      : this.clientX < offsetX
        ? 22
        : -22;
  }

  private _getInfoBoxYOffset(): number {
    const mapSize = this._getMapContainerSize();
    const offsetY = 300;
    return this.clientY < offsetY && (this.clientY > (mapSize.height - offsetY))
      ? -20
      : this.clientY < offsetY
        ? 12
        : -42;
  }

  private _getInfoBoxPositionClass(): string[] {
    const mapSize = this._getMapContainerSize();
    const offsetX = 170;
    const offsetY = 300;
    const classes = [];
    let yCenter = false;

    if (this.clientY < offsetY && (this.clientY > (mapSize.height - offsetY))) {
      classes.push('__y-center');
      yCenter = true;
    } else if (this.clientY < offsetY) {
      classes.push('__y-bottom');
    } else {
      classes.push('__y-top');
    }

    if (yCenter) {
      if (this.clientX < (offsetX * 2)) {
        classes.push('__x-right');
      } else {
        classes.push('__x-left');
      }
    } else {
      if ((this.clientX > offsetX) && (this.clientX < (mapSize.width - offsetX))) {
        classes.push('__x-center');
      } else if (this.clientX < offsetX) {
        classes.push('__x-right');
      } else if (this.clientX > (mapSize.width - offsetX)) {
        classes.push('__x-left');
      }
    }

    return classes;
  }

  private _getMapContainerSize(): MapSizeContainer {
    this._mapContainer = this._manager.getMap().container;
    return {
      width: this._mapContainer.offsetWidth,
      height: this._mapContainer.offsetHeight,
    };
  }

  private _open(): void {
    this.isShow = true;
    this._mapContainer && this._mapContainer.appendChild(this._infoBox.nativeElement);
    this._infoBox.nativeElement && this._setPosition();
  }

  private _close(): void {
    this.isShow = false;
  }

  private _setPosition(): void {
    this._renderer.setAttribute(this._infoBox.nativeElement, 'class',
      `${this._getInfoBoxPositionClass()[0]} ${this._getInfoBoxPositionClass()[1]}`);
    this._renderer.setStyle(this._infoBox.nativeElement, 'top', `${this.clientY + this._getInfoBoxYOffset()}px`);
    this._renderer.setStyle(this._infoBox.nativeElement, 'left', `${this.clientX + this._getInfoBoxXOffset()}px`);
    this._renderer.setStyle(this._infoBox.nativeElement, 'position', 'absolute');
  }

  private _setZIndex(): void {
    this._renderer.setStyle(this._infoBox.nativeElement, 'z-index', this.zIndex);
  }

}

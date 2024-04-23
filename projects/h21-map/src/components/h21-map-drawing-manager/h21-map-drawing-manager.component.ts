import {
  Component,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

// external libs
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// enums
import { DrawingButtonsModeName } from '../../enums/drawing-buttons-mode-name.enum';
import { DrawingButtonsIcon } from '../../enums/drawing-buttons-icon.enum';
import { MapStateDraw } from '../../enums/map-state-draw.enums';
import { MarkerIcon } from '../../enums/marker-icon-type.enum';
import { DrawingModes } from '../../enums/drawing-mode.enum';
import { EventType } from '../../enums/event-type.enum';

// models
import { DrawingButtons } from '../../models/drawing-buttons.model';
import { CircleEvent } from '../../models/circle-event.model';
import { MarkerEvent } from '../../models/marker-event.model';
import { AreaEvent } from '../../models/area-event.model';
import { Position } from '../../models/position.model';

// services
import { MapManager } from '../../manager/map-manager';

// interfaces
import { IDrawingOptions } from '../../interfaces/drawing-options.interface';

@Component({
  selector: 'h21-map-drawing-manager',
  templateUrl: './h21-map-drawing-manager.component.html',
  styleUrls: ['./h21-map-drawing-manager.component.scss'],
  providers: [DrawingButtons],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapDrawingManagerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public isDisableDrawingControl = true;
  @Input() public isShowDrawingControl = true;
  @Input() public isResetDrawingControl = null;
  @Input() public isResetButtons = false;
  @Input() public areaFitBounds = true;
  @Input() public isShowReset = true;
  @Input() public isShowArea = true;
  @Input() public isShowCircle = true;
  @Input() public isShowMarker = true;
  @Input() public isOpenMarker = false;
  @Input() public isOpenArea = true;
  @Input() public isOpenCircle = true;
  @Input() public isMarkerAnimate = true;
  @Input() public fillColor = '#0044d6';
  @Input() public fillOpacity = 0.08;
  @Input() public strokeColor = '#0044d6';
  @Input() public strokeOpacity = 0.7;
  @Input() public strokeWeight = 2.5;
  @Input() public areaCoordinates: Position[] = [];
  @Input() public circleRadius = 3000;
  @Input() public circleMaxRadius = 5000;
  @Input() public circleFitBounds = true;
  @Input() public markerLatitude = 59.939095;
  @Input() public markerLongitude = 30.315868;
  @Input() public markerFitBounds = true;
  @Input() public markerIconUrl = MarkerIcon.destination;
  @Input() public markerIconUrlSelected = MarkerIcon.destinationSelected;
  @Input() public markerIconWidth = 24;
  @Input() public markerIconHeight = 33;
  @Input() public drawingMode: DrawingModes = null;
  @Input() public isDraw = false;
  @Input() public isMoreArea = false;
  @Input() public isRedraw = false;
  @Input() public areaMaxSquare = 14;
  @Input() public areaIconVertex = 'https://svgshare.com/i/F1L.svg';

  @Output() public changedDrawingMode: Subject<DrawingModes> = new Subject<DrawingModes>();
  @Output() public areaCreate: Subject<AreaEvent> = new Subject<AreaEvent>();
  @Output() public areaRemove: Subject<AreaEvent> = new Subject<AreaEvent>();
  @Output() public areaDraw: Subject<void> = new Subject<void>();
  @Output() public markerMouseOver: Subject<any> = new Subject<any>();
  @Output() public markerClick: Subject<any> = new Subject<any>();
  @Output() public markerMouseOut: Subject<any> = new Subject<any>();
  @Output() public markerCreate: Subject<MarkerEvent> = new Subject<MarkerEvent>();
  @Output() public markerRemove: Subject<any> = new Subject<any>();
  @Output() public circleRadiusComplete: Subject<CircleEvent> = new Subject<CircleEvent>();
  @Output() public circleCenterComplete: Subject<CircleEvent> = new Subject<CircleEvent>();
  @Output() public circleCenterChange: Subject<CircleEvent> = new Subject<CircleEvent>();
  @Output() public circleRadiusChange: Subject<CircleEvent> = new Subject<CircleEvent>();
  @Output() public circleCreate: Subject<any> = new Subject<CircleEvent>();
  @Output() public circleRemove: Subject<CircleEvent> = new Subject<CircleEvent>();
  @Output() public circleRadiusMax: Subject<CircleEvent> = new Subject<CircleEvent>();

  public marker = 'marker';
  public activeMode: DrawingModes = null;
  private _drawingAddService: boolean;
  private _destroy$ = new Subject<boolean>();

  constructor(
    private _manager: MapManager,
    private _zone: NgZone,
    public buttons: DrawingButtons) {
  }

  public ngOnInit(): void { this.onInit(); }

  public onInit(): void {
    this._manager.getMap().loadMap$
      .pipe(
        filter(Boolean),
        takeUntil(this._destroy$),
      )
      .subscribe({ next: () => { this._zone.run(() => this._initService()); } });
    this._setShowButtons();
  }

  public ngOnChanges(changes) {

    changes.isShowMarker && this._setShowButtons();
    changes.isShowCircle && this._setShowButtons();
    changes.isShowArea && this._setShowButtons();
    changes.isResetButtons && this.resetButtons();

    if (!this._manager.getMap().drawing || !this._drawingAddService) { return; }

    if (changes.drawingMode) {
      this.isDraw = false;
      this.isRedraw = false;
      this.activeMode = null;
      this._manager.getMap().drawing.setMode(this);
    }
  }

  public ngOnDestroy(): void { this.destroy(); }

  public destroy() {
    this.isDisableDrawingControl = true;
    this._destroy$.next(true);
    this._destroy$.complete();
    this._manager.getMap().drawing.destroy();
    this._drawingAddService = false;
  }

  public activeButtons(mode: DrawingModes | MapStateDraw): void {
    this.buttons.list.forEach((key, index) => {
      mode === key.mode && this._setUnselected(index);
    });
  }

  public setMode(drawOptions: IDrawingOptions) {

    if (!drawOptions.isDraw) {
      this.activeMode = null;
      this.resetButtons();
    }
    drawOptions.isRedraw && !drawOptions.isDraw && this.activeButtons(drawOptions.drawMode);

    this.drawingMode = drawOptions.drawMode;
    this.markerLongitude = drawOptions.markerLongitude || 0;
    this.markerLatitude = drawOptions.markerLatitude || 0;
    this.circleRadius = drawOptions.circleRadius || 3000;
    this.isDraw = drawOptions.isDraw || false;
    this.isRedraw = drawOptions.isRedraw || false;
    this.areaCoordinates = drawOptions.areaCoordinates || null;
    this._setMode(drawOptions.drawMode, false);
  }

  public resetButtons(): void {
    this.isRedraw = false;
    this.buttons.list.forEach((key) => {
      key.isChecked = false;
      key.icon = DrawingButtonsIcon[key.name];
      key.title = `Set ${DrawingButtonsModeName[key.name]}`;
    });
  }

  public onSetDrawingMode(button: any, element: number): void {
    button.isChecked = !button.isChecked;
    if (button.isChecked) {
      button.icon = 'close';
      button.title = `Set ${DrawingButtonsModeName[button.name]}`;
      this._setButtons(element);
      this.isDraw = true;
      this.activeMode = button.mode;
      this._setMode(button.mode, true);
    } else {
      button.isChecked = false;
      this.activeMode = null;
      button.icon = DrawingButtonsIcon[button.name];
      button.title = `Set ${DrawingButtonsModeName[button.name]}`;
      this._setMode(DrawingModes.remove, true);
      this.isResetDrawingControl = true;
    }
  }

  private _initService(): void {
    if (!this._manager.getMap().drawing) { return; }

    if (!this._drawingAddService) {
      this.resetButtons();
      this._manager.getMap().drawing.initDrawingManager(this);
      this._drawingAddService = true;
    }
    this._addEventListeners();
    this._zone.run(() => {
      this.isDisableDrawingControl = false;
    });
  }

  private _setMode(mode: DrawingModes, isDrawingMode?: boolean): void {
    this.drawingMode = mode;
    this._manager.getMap().drawing && this._manager.getMap().drawing.setMode(this);
    isDrawingMode && this.changedDrawingMode.next(this.drawingMode);
  }

  private _setUnselected(index): void {
    const button = this.buttons.list[index];
    button.isChecked = true;
    this.activeMode = button.mode;
    button.icon = DrawingButtonsIcon.close;
    button.title = `Set ${DrawingButtonsModeName[button.name]}`;
  }

  private _setShowButtons(): void {
    this.buttons.list[0].isShow = this.isShowMarker;
    this.buttons.list[1].isShow = this.isShowCircle;
    this.buttons.list[2].isShow = this.isShowArea;
  }

  private _setButtons(element) {
    this.buttons.list.forEach((key, index) => {
      if (index !== element) {
        key.isChecked = false;
        key.icon = DrawingButtonsIcon[key.name];
      }
    });
  }

  private _addEventListeners(): void {

    this._manager.getMap().drawing.createEvent(EventType.drawAreaCreate)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (arrayArea: AreaEvent) => {
          this.buttons.list[2].title = `Remove ${DrawingButtonsModeName.area}`;
          this.areaCreate.next(arrayArea);
          if (this.isMoreArea && arrayArea.positions && arrayArea.positions.length === 5 || !this.isMoreArea) {
          }
        },
      });

    this._manager.getMap().drawing.createEvent(EventType.drawAreaDraw)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.areaDraw.next();
        },
      });

    this._manager.getMap().drawing.createEvent(EventType.drawAreaRemove)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (arrayArea: AreaEvent) => {
          this.buttons.list[2].title = `Set ${DrawingButtonsModeName.area}`;
          this.areaRemove.next(arrayArea);
          if (this.isMoreArea && arrayArea.positions && arrayArea.positions.length >= 5) { }
        },
      });

    this._manager.getMap().drawing.createEvent(EventType.drawCircleCentreComplete)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (event) => { this.circleCenterComplete.next(<CircleEvent>event); } });

    this._manager.getMap().drawing.createEvent(EventType.drawCircleRadiusChange)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (event) => { this.circleRadiusChange.next(<CircleEvent>event); } });

    this._manager.getMap().drawing.createEvent(EventType.drawCircleRadiusComplete)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (event) => { this.circleRadiusComplete.next(<CircleEvent>event); } });

    this._manager.getMap().drawing.createEvent(EventType.drawCircleCentreChange)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (event) => { this.circleCenterChange.next(<CircleEvent>event); } });

    this._manager.getMap().drawing.createEvent(EventType.drawCircleCreate)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (event) => {
          this.buttons.list[1].title = `Remove ${DrawingButtonsModeName.circle}`;
          this.circleCreate.next(event);
        },
      });

    this._manager.getMap().drawing.createEvent(EventType.drawCircleRemove)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (event) => {
          this.buttons.list[1].title = `Set ${DrawingButtonsModeName.circle}`;
          this.circleRemove.next(<CircleEvent>event);
        },
      });

    this._manager.getMap().drawing.createEvent(EventType.drawCircleRadiusMax)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => { this.circleRadiusMax.next(null); } });

    this._manager.getMap().drawing.createEvent(EventType.drawMarkerClick)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (event) => { this.markerClick.next(event); } });

    this._manager.getMap().drawing.createEvent(EventType.drawMarkerMouseOver)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (event) => { this.markerMouseOver.next(event); } });

    this._manager.getMap().drawing.createEvent(EventType.drawMarkerMouseOut)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (event) => { this.markerMouseOut.next(event); } });

    this._manager.getMap().drawing.createEvent(EventType.drawMarkerCreate)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (event: MarkerEvent) => {
          if (event.isDraw) {
            this.buttons.list[0].title = `Remove ${DrawingButtonsModeName.marker}`;
          }
          this.markerCreate.next(event);
        },
      });

    this._manager.getMap().drawing.createEvent(EventType.drawMarkerRemove)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (event) => {
          this.buttons.list[0].title = `Set ${DrawingButtonsModeName.marker}`;
          this.markerRemove.next(event);
        },
      });
  }

}

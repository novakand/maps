import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

// external libs
import { switchMap, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

// enums
import { CursorType } from '../../enums/cursor-type.enum';
import { EventType } from '../../enums/event-type.enum';
import { MapType } from '../../enums/map-type.enum';
import { LanguageCode } from '../../enums/language-service.enum';
import { Bounds } from '../../models/bounds-map.model';
import { ErrorMessages } from '../../enums/messages-error.enum';

// models
import { MapOptions } from '../../models/map-options.model';
import { Position } from '../../models/position.model';
import { MapStateOptions } from '../../models/map-state-options.model';
import { EventPosition } from '../../models/event-position.model';
import { ClientPosition } from '../../models/event-client-pixel.model';

// services
import { MapManager } from '../../manager/map-manager';
import { H21MapEventService } from '../../services/h21-map-event.service';

// components
import { H21MapDrawingManagerComponent } from '../h21-map-drawing-manager/h21-map-drawing-manager.component';
import { H21MapAutocompleteComponent } from '../h21-map-autocomplete/h21-map-autocomplete.component';
import { H21MapInfoBoxComponent } from '../h21-map-info-box/h21-map-info-box.component';

// directives
import { H21MapMarkerDirective } from '../../directives/h21-map-marker.directive';
import { H21MapClusterDirective } from '../../directives/h21-map-cluster.directive';
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';
import { H21MapServices } from '../../constanst/h21-map-services';
import { H21MapSaveService } from '../../services/h21-map-save.service';
import { H21MapTooltipComponent } from '../h21-map-tooltip/h21-map-tooltip.component';

let mapId = 0;
let selectedMap = MapType.google;

@Component({
  selector: 'h21-map',
  providers: H21MapServices,
  templateUrl: './h21-map.component.html',
  styleUrls: ['./h21-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class H21MapComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public provider: MapType;
  @Input() public longitude = 55.729823;
  @Input() public latitude = 37.640596;
  @Input() public fitBounds = true;
  @Input() public zoom = 3;
  @Input() public minZoom = 4;
  @Input() public maxZoom = 22;
  @Input() public isMain = false;
  @Input() public isDraggable = true;
  @Input() public isClick = true;
  @Input() public isDoubleClickZoom = true;
  @Input() public isScrollwheel = true;
  @Input() public defaultCursor = CursorType.default;
  @Input() public language = LanguageCode.en;
  @Input() public apiKey = null;

  @Output() public boundsChange: Subject<Bounds> = new Subject<Bounds>();
  @Output() public mapClick: Subject<EventPosition> = new Subject<EventPosition>();
  @Output() public mapDblClick: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public mapRightClick: Subject<ClientPosition> = new Subject<ClientPosition>();
  @Output() public mapMouseOver: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public mapMouseDrag: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public mapMouseOut: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public mapMouseDown: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public mapMouseUp: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public mapMouseMove: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public mapReady: Subject<boolean> = new Subject();
  @Output() public load: BehaviorSubject<boolean> = new BehaviorSubject(null);
  @Output() public updateReady: Subject<MapStateOptions> = new Subject<MapStateOptions>();
  @Output() public zoomChange: Subject<Number> = new Subject<Number>();
  @Output() public centerChange: Subject<Position> = new Subject<Position>();
  @Output() public countLoadsMarkers: Subject<Number> = new Subject<Number>();
  @Output() public mapErrorAPi: Subject<ErrorMessages> = new Subject<ErrorMessages>();
  @Output() public providerChange: Subject<void> = new Subject<void>();

  public MapTypeSelected = MapType;
  public countLoadMarkers = 0;

  @ViewChild('container') private _container: ElementRef;
  @ContentChild(H21MapDrawingManagerComponent) private _drawingManager: H21MapDrawingManagerComponent;
  @ContentChild(H21MapClusterDirective) private _cluster: H21MapClusterDirective;
  @ContentChild(H21MapMarkerDirective) private _marker: H21MapMarkerDirective;
  @ContentChild(H21MapRouteDirective) private _route: H21MapRouteDirective;
  @ContentChild(H21MapInfoBoxComponent) private _infoBox: H21MapInfoBoxComponent;
  @ContentChild(H21MapInfoBoxComponent) private _tooltip: H21MapTooltipComponent;
  @ContentChild(H21MapAutocompleteComponent) private _autocomplete: H21MapAutocompleteComponent;

  private readonly _id: string;
  private _mapAddService: boolean;
  private _childAddService: boolean;
  private _destroy$ = new Subject<boolean>();
  private _mapChanged$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public manager: MapManager,
    private _zone: NgZone,
    private _renderer: Renderer2,
    private _eventService: H21MapEventService,
    private _saveService: H21MapSaveService,
  ) {
    this._id = (mapId++).toString();
  }

  public ngOnInit(): void {
    this._selectedProvider();
    this._initMapInstance();
    this._setCallback();
  }

  public id(): string { return this._id; }
  public toString(): string { return `mapId-${this._id}`; }

  public selectedProviderMap(selectedProvider: MapType): MapType {
    const mapState = this._saveService.getMapOptions();
    this.providerChange.next();
    this.onDestroy();
    this.provider = selectedProvider;
    this.ngOnInit();
    this._mapChanged$
      .pipe(
        switchMap(() => this.mapReady),
      ).subscribe({
        next: () => {
          setTimeout(() => {
            this._zone.run(() => {
              this.updateReady.next(mapState);
            });
          }, 900);
          this._mapChanged$.complete();
        },
      });
    return this.provider;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this._mapAddService || !this.manager.getMap() || !this.language || !this.longitude) {
      return;
    }
    if (changes.latitude || changes.longitude) { this.manager.getMap().setCenter(this.latitude, this.longitude); }

    changes.zoom && this.manager.getMap().setZoom(this.zoom);
    changes.minZoom && this.manager.getMap().setMinZoom(this.minZoom);
    changes.maxZoom && this.manager.getMap().setMaxZoom(this.maxZoom);
    changes.scrollwheel && this.manager.getMap().setScrollwheel(this.isScrollwheel);
    changes.defaultCursor && this.manager.getMap().setDefaultCursor(this.defaultCursor);
    changes.click && this.manager.getMap().setClick(this.isClick);
    changes.disableDoubleClickZoom && this.manager.getMap().setDoubleClickZoom(this.isDoubleClickZoom);
    changes.fitBounds && this.manager.getMap().setFitBounds(this.fitBounds);
  }

  public ngOnDestroy(): void { this.onDestroy(); }

  public onDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
    this.manager.destroy();
    this._saveService.destroy();
    this._marker && this._marker.onDestroy();
    this._cluster && this._cluster.onDestroy();
    this._infoBox && this._infoBox.onDestroy();
    this._route && this._route.onDestroy();
    this._tooltip && this._tooltip.onDestroy();
    this._autocomplete && this._autocomplete.onDestroy();
    this._drawingManager && this._drawingManager.destroy();
    this._mapAddService = false;
    this._childAddService = true;
  }

  private _setAttribute(): void {
    this._renderer.setAttribute(this._container.nativeElement, 'map-main', `${this.isMain}`);
    this._renderer.setAttribute(this._container.nativeElement.parentElement, 'id', `h21-map-${this._id}`);
    this._renderer.setAttribute(this._container.nativeElement, 'map-container-id', `${this._id}`);
    this._renderer.setAttribute(this._container.nativeElement, 'map-provider', `${this.provider}`);
  }

  private _selectedProvider(): void {
    switch (this.provider) {
      case MapType.baidu:
        this._selectedMap(MapType.baidu);
        break;
      case MapType.yandex:
        this._selectedMap(MapType.yandex);
        break;
      case MapType.mapbox:
        this._selectedMap(MapType.mapbox);
        break;
      case MapType.auto:
        this._selectedMap(selectedMap);
        break;
      default:
        this._selectedMap(MapType.google);
        break;
    }
    this._autoProvider();
  }

  private _selectedMap(type: MapType): void { this.manager.selectMap(type); }

  private _createMapOptions(): MapOptions {
    return new MapOptions({
      center: new Position(this.latitude, this.longitude),
      zoom: this.zoom || 3,
      minZoom: this.minZoom || 4,
      maxZoom: this.maxZoom || 22,
      defaultCursor: this.defaultCursor,
      enableDraggable: this.isDraggable,
      enableScrollwheel: this.isScrollwheel,
      enableDoubleClickZoom: this.isDoubleClickZoom,
    });
  }

  private _initMapInstance(): void {
    this.manager.getMap().fitBonds = this.fitBounds;
    this.manager.getMap().loadAPI(this.language, this.apiKey)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (flag: boolean) => {
          if (!flag) { return; }
          this._setAttribute();
          this.manager.getMap().createMap(this._container.nativeElement, this._createMapOptions())
            .pipe(takeUntil(this._destroy$))
            .subscribe({
              next: (state) => {
                if (!state) { return; }
                this._mapAddService = true;
                this._addEventListeners();
                this._addEventListenerBoundsChange();
                this._addEventListenerZoomChange();
                this._addEventListenerCenterChange();
                this._addEventListenerClick();
                setTimeout(() => {
                  this._zone.run(() => {
                    this._mapChanged$.next();
                    this.mapReady.next(true);
                    this.load.next(true);
                    this._onInitChildComponent();
                    this._saveService.initService(this.manager);
                  });
                }, 1000);
              },
            });
        },
      });
  }

  private _onInitChildComponent() {
    if (!this._childAddService) { return; }
    this._cluster && this._cluster.onInit();
    this._infoBox && this._infoBox.onInit();
    this._drawingManager && this._drawingManager.onInit();
    this._autocomplete && this._autocomplete.onInit();
  }

  private _autoProvider(): void {
    if (this.isMain) { selectedMap = this.provider; }
  }

  private _addEventListeners(): void {
    this._eventService.addEventListeners(this.manager, EventType.drag)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => { this.mapMouseDrag.next(<MouseEvent>event); });

    this._eventService.addEventListeners(this.manager, EventType.dblClick)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => {
        this.mapMouseDrag.next(<MouseEvent>event);
      });

    this._eventService.addEventListenersRightClik(this.manager)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => {
        this.mapRightClick.next(event);
      });

    this._eventService.addEventListeners(this.manager, EventType.mouseOver)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => { this.mapMouseOver.next(<MouseEvent>event); });

    this._eventService.addEventListeners(this.manager, EventType.mouseOut)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => { this.mapMouseOut.next(<MouseEvent>event); });

    this._eventService.addEventListeners(this.manager, EventType.mouseMove)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => { this.mapMouseMove.next(<MouseEvent>event); });

    this._eventService.addEventListeners(this.manager, EventType.mouseUp)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => { this.mapMouseUp.next(<MouseEvent>event); });

    this._eventService.addEventListeners(this.manager, EventType.mouseDown)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => this.mapMouseDown.next(<MouseEvent>event));
  }

  private _addEventListenerZoomChange(): void {
    this._eventService.addEventListenersZoom(this.manager)
      .pipe(takeUntil(this._destroy$))
      .subscribe((zoom) => {
        this.manager.getMap().marker.resetMarkers();
        this.zoomChange.next(zoom);
      });
  }

  private _addEventListenerBoundsChange(): void {
    this._eventService.addEventListenersBounds(this.manager)
      .pipe(takeUntil(this._destroy$))
      .subscribe((bounds) => {
        this.boundsChange.next(bounds);
      });
  }

  private _addEventListenerCenterChange(): void {
    this._eventService.addEventListenersCenter(this.manager)
      .pipe(takeUntil(this._destroy$))
      .subscribe((center) => { this.centerChange.next(center); });
  }

  private _addEventListenerClick(): void {
    this._eventService.addEventListeners(this.manager, EventType.click)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (event) => {
          this.isClick && this.mapClick.next(this.manager.getMap().conversions.translatePosition(<any>event));
        },
      });
  }

  private _setCallback(): void {
    this.manager.getMap().marker.countLoadMarkers
      .pipe(takeUntil(this._destroy$))
      .subscribe((countMarkers) => {
        this.countLoadMarkers = countMarkers;
        this.countLoadsMarkers.next(countMarkers);
      });

    this.manager.getMap().mapErrorAPI
      .pipe(takeUntil(this._destroy$))
      .subscribe((status) => {
        this.mapErrorAPi.next(<ErrorMessages>status);
      });
  }

}

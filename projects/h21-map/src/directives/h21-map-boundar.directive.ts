import { AfterViewInit, Directive, Input, OnChanges, OnDestroy, Output, SimpleChange, } from '@angular/core';

// external libs
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// enums
import { EventType } from '../enums/event-type.enum';

// services
import { MapManager } from '../manager/map-manager';

// models
import { Position } from '../models/position.model';

let boundar = 0;

@Directive({
  selector: '[h21MapBoundar]',
})
export class H21MapBoundarDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input() public regionName;
  @Input() public fitBounds = true;
  @Input() public fillColor = '#FF5757';
  @Input() public fillOpacity = 0.045;
  @Input() public strokeColor = '#FF5757';
  @Input() public strokeOpacity = 0.8;
  @Input() public strokeWeight = 2;

  @Output() public click: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public createBoundar: Subject<Position[]> = new Subject<Position[]>();

  private readonly _id: string;
  private _boundariesAddService = false;
  private _destroy$ = new Subject<boolean>();

  constructor(private _manager: MapManager) {
    this._id = (boundar++).toString();
  }

  public id(): string {
    return this._id;
  }

  public toString(): string {
    return `boundar-${ this._id }`;
  }

  public ngAfterViewInit(): void {
    if (!this._manager.getMap().boundar) {
      return;
    }
    if (!this.regionName) {
      return;
    }

    if (!this._boundariesAddService) {
      this._manager.getMap().boundar.addBoundar(this);
      this._addEventListeners();
      this._boundariesAddService = true;
    }
  }

  public ngOnDestroy(): void {
    this._manager.getMap().boundar.removeBoundar(this);
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public ngOnChanges(changes: { [key: string]: SimpleChange }): void {
    if (!this._boundariesAddService) {
      return;
    }
    if (typeof this.regionName !== 'string') {
      return;
    }

    if (changes.regionName || changes.regionType) {
      this._manager.getMap().boundar.addBoundar(this);
    }
  }

  private _addEventListeners(): void {
    this._manager.getMap().boundar.createEvent(EventType.click, this)
    .pipe(takeUntil(this._destroy$))
    .subscribe((event) => {
      this.click.next(<MouseEvent>event);
    });

    this._manager.getMap().boundar.addBoundar$
    .pipe(takeUntil(this._destroy$))
    .subscribe(() => { });
  }

}

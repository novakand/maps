import {
  AfterViewInit,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange
} from '@angular/core';

// external libs
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// models
import { Position } from '../models/position.model';
import { Point } from '../models/point.model';

// services
import { MapManager } from '../manager/map-manager';

@Directive({
  selector: '[h21MapGeocoding]',
})
export class H21MapGeocodingDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input() public latitude: number;
  @Input() public longitude: number;
  @Input() public address: string;

  @Output() public directGeocodingResponse: Subject<Position> = new Subject<Position>();
  @Output() public reverseGeocodingResponse: Subject<Point> = new Subject<Point>();

  private _geocodingService: boolean;
  private _destroy$ = new Subject<boolean>();

  constructor(private manager: MapManager) { }

  public ngAfterViewInit(): void {
    if (!this.manager.getMap().geocoding) { return; }
  }

  public ngOnChanges(changes: { [key: string]: SimpleChange }): void {
    if (!this.manager.getMap().geocoding || !this._geocodingService) { return; }

    (changes.latitude || changes.longitude) && this.getAddress(this.latitude, this.longitude);
    changes.address && this.getCoordinates(this.address);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public getCoordinates(address): Observable<Position> {
    return new Observable((observer: Observer<Position>) => {
      this.manager.getMap().geocoding.getCoordinates(address)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (position) => {
            this.directGeocodingResponse.next(position);
            observer.next(position);
          },
        });
    });
  }

  public getAddress(latitude, longitude): Observable<Point> {
    return new Observable((observer: Observer<Point>) => {
      this.manager.getMap().geocoding.getAddress(latitude, longitude)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (address) => {
            this.reverseGeocodingResponse.next(address);
            observer.next(address);
          },
        });
    });
  }

}

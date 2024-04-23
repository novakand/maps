import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';

// external libs
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// enums
import { PlaceIconsType } from '../../enums/place-icons-type.enum';

// services
import { MapManager } from '../../manager/map-manager';

// models
import { Point } from '../../models/point.model';

@Component({
  selector: 'h21-map-autocomplete',
  templateUrl: './h21-map-autocomplete.component.html',
  styleUrls: ['./h21-map-autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class H21MapAutocompleteComponent implements OnDestroy, OnChanges {

  @Input() public minInputLength = 3;
  @Input() public isCities = false;
  @Input() public isShowAutocompleteControl = true;
  @Input() public isClear = false;

  @Output() public changeAutocomplete: Subject<string> = new Subject<string>();
  @Output() public changeSelectedAutocomplete: Subject<Point> = new Subject<Point>();
  @Output() public clickReset: Subject<void> = new Subject<void>();

  public isDisabledInput = false;
  public isShowLocation = true;
  public isShowReset = false;
  public controlAutocomplete = new FormControl();
  public filteredOptions: Observable<string[]>;
  public points: Point[] = [];
  public typePlaceIcons: PlaceIconsType;
  public valueInput;

  private _destroy$ = new Subject<boolean>();

  constructor(
    private _manager: MapManager,
    private _cdr: ChangeDetectorRef,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    changes.isClear && this.inputClear();
  }

  public ngOnDestroy(): void {
    this.onDestroy();
  }

  public onDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this.isDisabledInput = true;
    this.points = [];
  }

  public onInit(): void {
    this.isDisabledInput = false;
  }

  public onAutocompleteChange(value: string): void {
    this._isShowButton(Boolean(value.length));
    if (!value.length) {
      return;
    }
    this._manager.getMap().search.searchAutocomplete(value, this.isCities)
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (points: Point[]) => {
        this.setData(points);
        this._cdr.detectChanges();
      },
    });
    this.changeAutocomplete.next(value);
  }

  public onSelectedChange(point: Point, event): void {
    if (point && event.source.selected) {
      if (!point) {
        return;
      }
      if (!point.position) {
        this._manager.getMap().search.searchDetails(point.googlePlaceId)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (place: Point) => {
            this.changeSelectedAutocomplete.next(place);
          },
        });
      } else {
        this.changeSelectedAutocomplete.next(point);
      }
    }
    this._isShowButton(Boolean(1));
  }

  public setData(data: Point[]): void {
    this.points = [];
    this.points = data;
  }

  public getIcon(type: string): string {
    return PlaceIconsType[type];
  }

  public trackByFn(index: number): number {
    return index;
  }

  public inputClear(enabled?: boolean): void {
    this.valueInput = null;
    this._isShowButton(false);
    !enabled && this.clickReset.next();
  }

  private _isShowButton(enabled) {
    this.isShowReset = enabled;
    this.isShowLocation = !enabled;
  }

}

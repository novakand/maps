import {
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';

// external libs
import { Subject } from 'rxjs';

// models
import { Point } from '../models/point.model';

// services
import { MapManager } from '../manager/map-manager';

@Directive({
  selector: '[h21MapSearch]',
})
export class H21MaSearchDirective implements OnChanges, OnDestroy {

  @Input() public query: string;
  @Input() public language: string;
  @Input() public countPlace: string;

  @Output() public searchPlaceResponce: Subject<Point[]> = new Subject<Point[]>();
  @Output() public searchAutocompleteResponce: Subject<Point[]> = new Subject<Point[]>();

  private _searchAddService: boolean;
  private _destroy$ = new Subject<boolean>();

  constructor(private manager: MapManager) { }

  public ngOnChanges(): void {
    if (!this.manager.getMap().search) {
      return;
    }
    if (!this._searchAddService) {
      return;
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

}

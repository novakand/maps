import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

// external libs
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// enums
import { LanguageCode } from '../../enums/language-service.enum';

// services
import { MapManager } from '../../manager/map-manager';

// components
import { H21MapComponent } from '../h21-map/h21-map.component';

@Component({
  selector: 'h21-map-language-control',
  templateUrl: './h21-map-language-control.component.html',
  styleUrls: ['./h21-map-language-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapLanguageControlComponent implements OnInit, OnDestroy {

  @Input() public isShowControl = true;
  @Input() public isDisableControl = false;
  @Input() public placeholder = 'Select Language';

  @Output() public changeLanguage: Subject<any> = new Subject<any>();

  public selectedOption: any;
  public options = [];
  private _destroy$ = new Subject<boolean>();

  constructor(
    private _manager: MapManager,
    @ViewChild(H21MapComponent) private _map: H21MapComponent) {
  }

  public ngOnInit(): void {
    this._setMapReady();
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public destroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index) {
    return index;
  }

  public onLanguageChange(event): void {
    this.isDisableControl = true;
    this._map.language = event.code;
    this._map.selectedProviderMap(this._map.provider);
  }

  public getData(): void {
    if (!this._map) {
      return;
    }
    this.options = this._manager.getMap().getLanguageDictionary();
    this.selectedOption = this._map.language;
    this._checkLangCode();
  }

  private _setMapReady() {
    this._map.mapReady
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: () => {
        this.getData();
        this.isDisableControl = false;
      },
    });

    this._map.providerChange
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: () => {
        this.isDisableControl = true;
      },
    });
  }

  private _checkLangCode(): void {
    if (this.options.length > 1) {
      const code = this.options.some((name) => (name.code === this._map.language));
      if (!code) {
        this.selectedOption = LanguageCode.en;
      }
      this.isDisableControl = false;
    } else {
      this.isDisableControl = true;
      this.selectedOption = this.options[0].code;
    }
  }

}

import { Component, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation, } from '@angular/core';

// external libs
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// enums
import { MapType } from '../../enums/map-type.enum';

// models
import { ProviderCheckbox } from '../../models/provider-checkbox-model';

// components
import { H21MapComponent } from '../h21-map/h21-map.component';

@Component({
  selector: 'h21-map-provider-control',
  templateUrl: './h21-map-provider-control.component.html',
  styleUrls: ['./h21-map-provider-control.component.scss'],
  providers: [ProviderCheckbox],
  encapsulation: ViewEncapsulation.None,
})
export class H21MapProviderControlComponent implements OnInit, OnDestroy {

  @Input() public isShowControl = true;
  @Input() public isDisabledControl = true;

  @Output() public changedProvider: Subject<any> = new Subject<any>();

  public provider: MapType = null;
  private _ProviderAddService: boolean;

  private _destroy$ = new Subject<boolean>();

  constructor(
    @ViewChild(H21MapComponent)
    private _map: H21MapComponent,
    public providerType: ProviderCheckbox,
  ) { }

  public ngOnInit() {
    this._onInit();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public onChangeChecked(button: any, element: number): void {
    if (this.provider === button.name) {
      return;
    }
    this.isDisabledControl = true;
    button.isChecked = !button.isChecked;
    if (button.isChecked) {
      this._unChecked(element);
      this.provider = this._map.selectedProviderMap(button.name);
    } else {
      button.isChecked = false;
    }

    this.changedProvider.next(button.name);
  }

  public getProvider(type: MapType): boolean {
    return this.provider === type;
  }

  public trackByFn(index: number): number {
    return index;
  }

  private _onInit(): void {
    this._map.load
    .pipe(
      filter(Boolean),
      takeUntil(this._destroy$),
    )
    .subscribe({
      next: () => {
        if (!this._ProviderAddService) {
          this.provider = this._map.provider;
          this._onlyChecked();
          this._ProviderAddService = true;
        }

        this.isDisabledControl = false;
      },
    });
  }

  private _unChecked(element) {
    this.providerType.list.forEach((key, index) => {
      if (index !== element) {
        key.isChecked = false;
      }
    });
  }

  private _onlyChecked() {
    this.providerType.list.forEach((key, index) => {
      if (key.name === this.provider) {
        key.isChecked = true;
      }
    });
  }

}


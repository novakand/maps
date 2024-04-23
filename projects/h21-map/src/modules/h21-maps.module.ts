import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// directives
import { H21MapRouteDirective } from '../directives/h21-map-route.directive';
import { H21MaSearchDirective } from '../directives/h21-map-search.directive';
import { H21MapMarkerDirective } from '../directives/h21-map-marker.directive';
import { H21MapClusterDirective } from '../directives/h21-map-cluster.directive';
import { H21MapGeocodingDirective } from '../directives/h21-map-geocoding.directive';
import { H21MapBoundarDirective } from '../directives/h21-map-boundar.directive';

// modules
import { H21MapFullscreenControlModule } from '../components/h21-map-fullscreen-control/h21-map-fullscreen.module';
import { H21MapAutocompleteModule } from '../components/h21-map-autocomplete/h21-map-autocomplete.module';
import { H21MapInfoBoxModule } from '../components/h21-map-info-box/h21-map-info-box.module';
import { H21MapLanguageControlModule } from '../components/h21-map-language-control/h21-map-language-control.module';
import { H21MapLegendsControlModule } from '../components/h21-map-legends-control/h21-map-legends-control.module';
import { H21MapPreloaderModule } from '../components/h21-map-preloader/h21-map-preloader.module';
import { H21MapProviderControlModule } from '../components/h21-map-provider-control/h21-map-provider-control.module';
import { H21MapSettingsControlModule } from '../components/h21-map-settings-control/h21-map-settings-control.module';
import { H21MapSlidePanelModule } from '../components/h21-map-slide-panel/h21-map-slide-panel.module';
import { H21MapTooltipModule } from '../components/h21-map-tooltip/h21-map-tooltip.module';
import { H21MapZoomControlModule } from '../components/h21-map-zoom-control/h21-map-zoom-control.module';
import { H21MapDrawingManagerModule } from '../components/h21-map-drawing-manager/h21-map-drawing-manager.module';
import { H21MapPoiToggleControlModule } from '../components/h21-map-poi-toggle-control/h21-map-poi-toggle-control.module';
import { H21MapModule } from '../components/h21-map/h21-map-module';
import { H21MapDataLayerDirective } from '../directives/h21-map-data-layer.directive';

@NgModule({
  imports: [
    CommonModule,
    H21MapLanguageControlModule,
    H21MapFullscreenControlModule,
    H21MapAutocompleteModule,
    H21MapInfoBoxModule,
    H21MapLegendsControlModule,
    H21MapPreloaderModule,
    H21MapProviderControlModule,
    H21MapSettingsControlModule,
    H21MapSlidePanelModule,
    H21MapTooltipModule,
    H21MapZoomControlModule,
    H21MapDrawingManagerModule,
    H21MapPoiToggleControlModule,
    H21MapModule,
  ],
  exports: [
    H21MapDataLayerDirective,
    H21MapRouteDirective,
    H21MapBoundarDirective,
    H21MaSearchDirective,
    H21MapMarkerDirective,
    H21MapClusterDirective,
    H21MapGeocodingDirective,
    H21MapFullscreenControlModule,
    H21MapAutocompleteModule,
    H21MapInfoBoxModule,
    H21MapLanguageControlModule,
    H21MapLegendsControlModule,
    H21MapPreloaderModule,
    H21MapProviderControlModule,
    H21MapSettingsControlModule,
    H21MapSlidePanelModule,
    H21MapTooltipModule,
    H21MapZoomControlModule,
    H21MapDrawingManagerModule,
    H21MapPoiToggleControlModule,
    H21MapModule,

  ],
  declarations: [
    H21MapDataLayerDirective,
    H21MapMarkerDirective,
    H21MapClusterDirective,
    H21MaSearchDirective,
    H21MapBoundarDirective,
    H21MapGeocodingDirective,
    H21MapRouteDirective,
  ],
  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
  ],
})
export class H21MapsModule { }

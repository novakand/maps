import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// services
import { MapManager } from '../../manager/map-manager';

// models
import { BaiduApiConfig } from '../../models/baidu/baidu-api-config.model';
import { GoogleApiConfig } from '../../models/google/google-api-config.model';
import { MapboxApiConfig } from '../../models/mapbox/mapbox-api-config.model';
import { YandexApiConfig } from '../../models/yandex/yandex-api-config.model';

import { BaiduAddressService } from '../../services/baidu/baidu-address';
import { BaiduBoundarService } from '../../services/baidu/baidu-boundar';
import { BaiduMarkerClusterService } from '../../services/baidu/baidu-cluster';
import { BaiduConversionsService } from '../../services/baidu/baidu-conversions';
import { BaiduDistanceService } from '../../services/baidu/baidu-distance';
import { BaiduDrawingService } from '../../services/baidu/baidu-drawing';
import { BaiduEventService } from '../../services/baidu/baidu-event';
import { BaiduGeocodingService } from '../../services/baidu/baidu-geocoding';
import { BaiduGeoLocationService } from '../../services/baidu/baidu-geolocation';
import { BaiduMapService } from '../../services/baidu/baidu-map';
import { BaiduMarkerService } from '../../services/baidu/baidu-marker';
import { BaiduRouteService } from '../../services/baidu/baidu-route';
import { BaiduRouteCarService } from '../../services/baidu/baidu-route-car';
import { BaiduRouteFlyService } from '../../services/baidu/baidu-route-fly';
import { BaiduRouteRailsService } from '../../services/baidu/baidu-route-rail';
import { BaiduRouteTransitService } from '../../services/baidu/baidu-route-transit';
import { BaiduRouteWalkService } from '../../services/baidu/baidu-route-walk';
import { BaiduSearchService } from '../../services/baidu/baidu-search';

import { GoogleAddressService } from '../../services/google/google-address';
import { GoogleBoundarService } from '../../services/google/google-boundar';
import { GoogleMarkerClusterService } from '../../services/google/google-cluster';
import { GoogleConversionsService } from '../../services/google/google-conversions';
import { GoogleDistanceService } from '../../services/google/google-distance';
import { GoogleDrawingService } from '../../services/google/google-drawing';
import { GoogleEventService } from '../../services/google/google-event';
import { GoogleGeocodingService } from '../../services/google/google-geocoding';
import { GoogleGeoLocationService } from '../../services/google/google-geolocation';
import { GoogleMapService } from '../../services/google/google-map';
import { GoogleMarkerService } from '../../services/google/google-marker';
import { GoogleRouteService } from '../../services/google/google-route';
import { GoogleRouteCarService } from '../../services/google/google-route-car';
import { GoogleRouteFlyService } from '../../services/google/google-route-fly';
import { GoogleRouteRailsService } from '../../services/google/google-route-rail';
import { GoogleRouteTransitService } from '../../services/google/google-route-transit';
import { GoogleRouteWalkService } from '../../services/google/google-route-walk';
import { GoogleSearchService } from '../../services/google/google-search';
import { H21MapEventService } from '../../services/h21-map-event.service';
import { H21MapSaveService } from '../../services/h21-map-save.service';

import { MapboxAddressService } from '../../services/mapbox/mapbox-address';
import { MapboxBoundarService } from '../../services/mapbox/mapbox-boundar';
import { MapboxMarkerClusterService } from '../../services/mapbox/mapbox-cluster';
import { MapboxConversionsService } from '../../services/mapbox/mapbox-conversions';
import { MapboxDistanceService } from '../../services/mapbox/mapbox-distance';
import { MapboxDrawingService } from '../../services/mapbox/mapbox-drawing';
import { MapboxEventService } from '../../services/mapbox/mapbox-event';
import { MapboxGeocodingService } from '../../services/mapbox/mapbox-geocoding';
import { MapboxGeoLocationService } from '../../services/mapbox/mapbox-geolocation';
import { MapboxMapService } from '../../services/mapbox/mapbox-map';
import { MapboxMarkerService } from '../../services/mapbox/mapbox-marker';
import { MapboxRouteService } from '../../services/mapbox/mapbox-route';
import { MapboxRouteCarService } from '../../services/mapbox/mapbox-route-car';
import { MapboxRouteFlyService } from '../../services/mapbox/mapbox-route-fly';
import { MapboxRouteRailsService } from '../../services/mapbox/mapbox-route-rail';
import { MapboxRouteTransitService } from '../../services/mapbox/mapbox-route-transit';
import { MapboxRouteWalkService } from '../../services/mapbox/mapbox-route-walk';
import { MapboxSearchService } from '../../services/mapbox/mapbox-search';

import { YandexAddressService } from '../../services/yandex/yandex-address';
import { YandexBoundarService } from '../../services/yandex/yandex-boundar';
import { YandexMarkerClusterService } from '../../services/yandex/yandex-cluster';
import { YandexConversionsService } from '../../services/yandex/yandex-conversions';
import { YandexDistanceService } from '../../services/yandex/yandex-distance';
import { YandexDrawingService } from '../../services/yandex/yandex-drawing';
import { YandexEventService } from '../../services/yandex/yandex-event';
import { YandexGeocodingService } from '../../services/yandex/yandex-geocoding';
import { YandexGeoLocationService } from '../../services/yandex/yandex-geolocation';
import { YandexMapService } from '../../services/yandex/yandex-map';
import { YandexMarkerService } from '../../services/yandex/yandex-marker';
import { YandexRouteService } from '../../services/yandex/yandex-route';
import { YandexRouteCarService } from '../../services/yandex/yandex-route-car';
import { YandexRouteFlyService } from '../../services/yandex/yandex-route-fly';
import { YandexRouteRailsService } from '../../services/yandex/yandex-route-rail';
import { YandexRouteTransitService } from '../../services/yandex/yandex-route-transit';
import { YandexRouteWalkService } from '../../services/yandex/yandex-route-walk';
import { YandexSearchService } from '../../services/yandex/yandex-search';

// component
import { H21MapComponent } from './h21-map.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    H21MapComponent,
  ],
  exports: [
    H21MapComponent,
  ],
  providers: [
    H21MapSaveService,
    H21MapComponent,
    GoogleApiConfig,
    GoogleAddressService,
    GoogleMapService,
    GoogleBoundarService,
    GoogleDrawingService,
    GoogleDistanceService,
    GoogleMarkerClusterService,
    GoogleEventService,
    GoogleRouteService,
    GoogleRouteCarService,
    GoogleRouteRailsService,
    GoogleRouteFlyService,
    GoogleRouteTransitService,
    GoogleRouteWalkService,
    GoogleMarkerService,
    GoogleSearchService,
    GoogleGeocodingService,
    GoogleGeoLocationService,
    GoogleConversionsService,
    YandexApiConfig,
    YandexAddressService,
    YandexMapService,
    YandexBoundarService,
    YandexDrawingService,
    YandexDistanceService,
    YandexMarkerClusterService,
    YandexEventService,
    YandexRouteService,
    YandexRouteCarService,
    YandexRouteRailsService,
    YandexRouteFlyService,
    YandexRouteTransitService,
    YandexRouteWalkService,
    YandexMarkerService,
    YandexSearchService,
    YandexGeocodingService,
    YandexGeoLocationService,
    YandexConversionsService,
    MapboxApiConfig,
    MapboxAddressService,
    MapboxMapService,
    MapboxBoundarService,
    MapboxDrawingService,
    MapboxDistanceService,
    MapboxMarkerClusterService,
    MapboxEventService,
    MapboxRouteService,
    MapboxRouteCarService,
    MapboxRouteRailsService,
    MapboxRouteFlyService,
    MapboxRouteTransitService,
    MapboxRouteWalkService,
    MapboxMarkerService,
    MapboxSearchService,
    MapboxGeocodingService,
    MapboxGeoLocationService,
    MapboxConversionsService,
    BaiduApiConfig,
    BaiduAddressService,
    BaiduMapService,
    BaiduBoundarService,
    BaiduDrawingService,
    BaiduDistanceService,
    BaiduMarkerClusterService,
    BaiduEventService,
    BaiduRouteService,
    BaiduRouteCarService,
    BaiduRouteRailsService,
    BaiduRouteFlyService,
    BaiduRouteTransitService,
    BaiduRouteWalkService,
    BaiduMarkerService,
    BaiduSearchService,
    BaiduGeocodingService,
    BaiduGeoLocationService,
    BaiduConversionsService,
    H21MapEventService,
    MapManager,
  ],
})
export class H21MapModule {
}

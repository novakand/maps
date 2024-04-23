
import { Position } from 'projects/h21-map/src/models/position.model';
import { HttpClient } from '@angular/common/http';
import { H21MapMarkerDirective } from 'projects/h21-map/src/directives/h21-map-marker.directive';
import { RouteMode } from 'projects/h21-map/src/enums/route-type.enum';
import { MapType } from 'projects/h21-map/src/enums/map-type.enum';
import { DrawingModes } from 'projects/h21-map/src/enums/drawing-mode.enum';
import { H21MapGeocodingDirective } from 'projects/h21-map/src/directives/h21-map-geocoding.directive';
import { H21MaSearchDirective } from 'projects/h21-map/src/directives/h21-map-search.directive';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IRoute } from 'src/app/interfaces/route.interface';
import { IMapOptions } from 'src/app/interfaces/map-options-model.interfase';
import { IClusterOptions } from 'src/app/interfaces/cluster-options.interface';
import { IStateMapOptions } from 'src/app/interfaces/map-state-options.interface';
import { TypePoint } from 'src/app/enums/point-type.enum';
import { IInfoBoxOptions } from 'src/app/interfaces/info-box-options.interface';
import { ITooltipOptions } from 'src/app/interfaces/tooltip-options.interface';
import { MarkerIcon } from 'projects/h21-map/src/enums/marker-icon-type.enum';
import { H21MapAutocompleteComponent } from 'projects/h21-map/src/components/h21-map-autocomplete/h21-map-autocomplete.component';
import { H21MapSlidePanelComponent } from 'projects/h21-map/src/components/h21-map-slide-panel/h21-map-slide-panel.component';
import { CursorType, RouteColor, } from 'projects/h21-map/src/enums';
import { MatMenuTrigger } from '@angular/material';
import { H21MapComponent } from 'projects/h21-map/src/components/h21-map/h21-map.component';
import { H21MapDrawingManagerComponent } from 'projects/h21-map/src/components/h21-map-drawing-manager/h21-map-drawing-manager.component';
import { DistancePositions } from 'projects/h21-map/src/models/distance-positions.model';
import { IDrawingOptions } from 'projects/h21-map/src/interfaces/drawing-options.interface';
import { IMarker } from 'src/app/interfaces/marker.interface';
import { ICircle } from 'src/app/interfaces/circle.interface';
import { environment } from 'src/app/environments/environment';
import { pluck, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-h21-maps',
    templateUrl: './h21-maps.component.html',
    styleUrls: ['./h21-maps.component.scss'],
})

export class H21MapsComponent implements OnInit {

    @ViewChild('map') public map: H21MapComponent;
    @ViewChild('autocomplete') public autocomplete: H21MapAutocompleteComponent;
    @ViewChild(H21MapMarkerDirective) public marker: H21MapMarkerDirective;
    @ViewChild('drawing') public drawing: H21MapDrawingManagerComponent;
    @ViewChild(H21MapAutocompleteComponent) public autoComplete: H21MapAutocompleteComponent;
    @ViewChild('sidebar') public sidebar: H21MapSlidePanelComponent;
    @ViewChild('sidebar2') public sidebar2: H21MapSlidePanelComponent;
    @ViewChild(H21MapGeocodingDirective) public geocoding: H21MapGeocodingDirective;
    @ViewChild(H21MaSearchDirective) public search: H21MaSearchDirective;
    @ViewChild(MatMenuTrigger) public contextMenu: MatMenuTrigger;

    public tabPanel = 'map';
    public isMap = true;
    public title = 'map';
    public markers: IMarker[] = [];
    public boundares: IBoundar[] = [];
    public markersFilter: IMarker[] = [];
    public routes: IRoute[] = [];
    public circles: ICircle[] = [];
    public isGetLocation = true;
    public contextMenuPosition = { x: '0px', y: '0px' };
    public pickUp = null;
    public dropDown = null;
    public point = LocationType;
    public filter: Filter = {
        hotel: true,
        route: true,
        airport: true,
        favorite: true,
    };

    public drawingOptions: IDrawingOptions = {
        circleMaxRadius: 5000,
        circleRadius: 3000,
        drawMode: null,
        markerLatitude: 0,
        markerLongitude: 0,
        markerFitBounds: true,
        circleLatitude: 0,
        circleLongitude: 0,
        circleFitBounds: true,
        isDraw: false,
        isRedraw: false,
        areaCoordinates: [],
        areaFitBounds: true,
    };

    public mapOptions: IMapOptions = {
        latitude: 55.729823,
        longitude: 37.640596,
        zoom: 10,
        minZoom: 2,
        maxZoom: 22,
        preloaderIsOpen: false,
        provider: MapType.mapbox,
        language: null,
        enableClick: true,
        defaultCursor: 'default',
    };

    public mapStateOptions: IStateMapOptions = {
        preloaderIsOpen: false,
        provider: MapType.yandex,
        enableDefaultControl: false,
        enableClick: true,
        markers: [],
        circle: null,
        area: [],
    };

    public clusterOptions: IClusterOptions = {
        gridSize: 100,
        minimumClusterSize: 3,
        maxZoom: 14,
    };

    public tooltipOptions: ITooltipOptions = {
        clientX: 0,
        clientY: 0,
        isShow: false,
        title: 'radius',
    };

    public infoBoxOptions: IInfoBoxOptions = {
        clientX: 0,
        clientY: 0,
        title: '',
        discription: '',
        isShow: false,
    };

    public geoJsonObject = null;

    constructor(private cdr: ChangeDetectorRef, private http: HttpClient) { }

    public ngOnInit(): void { }

    public changedAutocomplete(): void {
        this.drawingOptions.drawMode = DrawingModes.reset;
        this.cdr.detectChanges();
    }

    public onRoute(position: Position, point: LocationType): void {
        if (point === LocationType.pickUp) {
            this.pickUp = position;
        }
        if (point === LocationType.dropDown) {
            this.dropDown = position;
        }

        this.markers = this.markers.filter((item) => item.typePoint !== TypePoint[point]);

        this.markers.push({
            latitude: position.latitude,
            longitude: position.longitude,
            iconUrl: MarkerIcon[point],
            id: 1,
            iconHeight: 33,
            iconZIndex: 99,
            isCluster: false,
            typePoint: TypePoint[point],
        });


        this.markers.push({
            latitude: position.latitude,
            longitude: position.longitude,
            iconUrl: MarkerIcon[point],
            iconHeight: 33,
            id: 2,
            iconZIndex: 99,
            isCluster: false,
            typePoint: TypePoint[point],
        });


        if (this.pickUp && this.dropDown) {

            const distance = new DistancePositions({});
            distance.startPosition = new Position(this.pickUp.latitude, this.pickUp.longitude);
            distance.endPosition = new Position(this.dropDown.latitude, this.dropDown.longitude);
            this.routes = [];
            this.routes.push({
                startLatitude: this.pickUp.latitude,
                startLongitude: this.pickUp.longitude,
                endLatitude: this.dropDown.latitude,
                fitBounds: false,
                endLongitude: this.dropDown.longitude,
                strokeColor: RouteColor.transfer,
                strokeWeight: 4,
                routeMode: RouteMode.car,
            });
        }

    }

    public getGeoJson(query) {
        this.boundares = [];
        this.boundares.push({
            regionName: query,
        });
    }

    public createBoundar() { }

    public markerClick(event) {
        this.infoBoxOptions.clientX = event.clientX;
        this.infoBoxOptions.clientY = event.clientY;
        this.infoBoxOptions.isShow = true;
    }

    public mapRightClick(event) {
        this.contextMenuPosition.x = `${event.clientX}px`;
        this.contextMenuPosition.y = `${event.clientY}px`;
        this.contextMenu.menuData = { item: event.position };
        this.contextMenu.closeMenu();
        this.contextMenu.openMenu();
    }

    public mapClick(event) {
      
        const d =  this.map.manager.getMap().getStaticUrl(event.position.latitude,event.position.longitude,'https://ref21pro-t2.azurewebsites.net/cdn/icons/hotelLocation.png')
        console.log(d)
    }

    public addMarkerDist(position: Position) {
        this.cdr.detectChanges();
        this.drawingOptions.isDraw = false;
        this.drawingOptions.drawMode = DrawingModes.reset;
        this.cdr.detectChanges();
        this.drawingOptions.markerLatitude = position.latitude;
        this.drawingOptions.markerLongitude = position.longitude;
        this.cdr.detectChanges();
        this.drawingOptions.markerFitBounds = true;
        this.drawingOptions.drawMode = DrawingModes.marker;
        this.mapOptions.defaultCursor = CursorType.pickUp;
        this.cdr.detectChanges();
    }

    public animateMarker(id: number, isOut: boolean): void {
        const marker = this.markers.find((item) => item.id === id);
        if (!marker) { return; }
        marker.isLabelActive = isOut ? false : true;
    }

    public markerMouseOver(marker: IMarker, event): void {
        this.infoBoxOptions.clientX = event.clientX;
        this.infoBoxOptions.clientY = event.clientY;
        this.infoBoxOptions.isShow = true;

    }

    public markerMouseOut(marker: IMarker) {
        this.infoBoxOptions.isShow = false;
    }

    public mapReady(flag: boolean): void {

        // this.markers.push({
        //     latitude: 55.751999,
        //     longitude: 37.617734,
        //     iconUrl: MarkerIcon.favorite,
        //     isCluster: true,
        // });

        // this.markers.push({
        //     latitude: 55.755814,
        //     longitude: 37.617635,
        //     animate: null,
        //     iconUrl: MarkerIcon.hotel,
        //     labelClass: 'h21-map-price-marker',
        //     id: 1,
        //     labelContent: '<div class="h21-map-price-marker-inner">125 EUR </div>',
        //     isCluster: true,
        // });


        // this.markers.push({
        //     latitude: 55.755814,
        //     longitude: 37.617635,
        //     animate: null,
        //     iconUrl: MarkerIcon.hotel,
        //     labelClass: 'h21-map-price-marker',
        //     id: 2,
        //     labelContent: '<div class="h21-map-price-marker-inner">125 EUR </div>',
        //     isCluster: true,
        // });

        // this.markers.push({
        //     latitude: 55.747581,
        //     longitude: 37.531936,
        //     labelContent: null,
        //     iconUrl: MarkerIcon.favorite,
        //     isCluster: true,
        // });

        // this.markers.push({
        //     latitude: 55.747581,
        //     longitude: 37.531936,
        //     iconUrl: MarkerIcon.hotel,
        //     isCluster: true,
        // });

        // this.markers.push({
        //     latitude: 55.79,
        //     longitude: 37.99,
        //     iconUrl: MarkerIcon.hotel,
        //     isCluster: true,
        // });

    }

    public routeReady(route) {
        if (!route) { return; }

        if (route.routeMode === RouteMode.transit) { return; }

        if (!route.routePosition) { return; }
        if (route.originPosition.startPosition.latitude
            === route.originPosition.endPosition.latitude
            && route.originPosition.startPosition.longitude
            === route.originPosition.endPosition.longitude) { return; }

        this.routes.push({
            startLatitude: route.originPosition.startPosition.latitude,
            startLongitude: route.originPosition.startPosition.longitude,
            endLatitude: route.routePosition.startPosition.latitude,
            endLongitude: route.routePosition.startPosition.longitude,
            strokeColor: RouteColor.transit,
            strokeWeight: 4,
            strokeOpacity: 0.9,
            routeMode: RouteMode.transit,
        });

        this.routes.push({
            startLatitude: route.originPosition.endPosition.latitude,
            startLongitude: route.originPosition.endPosition.longitude,
            endLatitude: route.routePosition.endPosition.latitude,
            endLongitude: route.routePosition.endPosition.longitude,
            strokeColor: RouteColor.transit,
            strokeWeight: 4,
            strokeOpacity: 0.9,
            routeMode: RouteMode.transit,
        });

    }


    public onChangedLegend(event) { }

    public setPoints(): void { }

    public clusterClick() { }

    public updateMapReady(event): void {

        if (event.drawMarker) {
            this.drawing.setMode({
                drawMode: DrawingModes.marker,
                markerLatitude: event.drawMarker.position.latitude,
                markerLongitude: event.drawMarker.position.longitude,
                isRedraw: Boolean(event.drawMode.mode),
            });
        }


        if (event.drawCircle) {
            this.drawing.setMode({
                drawMode: DrawingModes.circle,
                circleRadius: event.drawCircle.radius,
                markerLatitude: event.drawCircle.position.latitude,
                markerLongitude: event.drawCircle.position.longitude,
                isRedraw: Boolean(event.drawMode.mode),
            });
        }

        if (event.drawArea) {
            this.drawing.setMode({
                drawMode: DrawingModes.area,
                areaCoordinates: event.drawArea.position,
                isRedraw: Boolean(event.drawMode.mode),
            });
        }
    }

    public onAutocompleteSelected(point: any): void {
        this.drawing.setMode({
            drawMode: DrawingModes.circle,
            circleRadius: 4000,
            isDraw: false,
            markerLatitude: point.position.latitude,
            markerLongitude: point.position.longitude,
            isRedraw: false,
        });

    }

    public circleRadiusChangeDrawing(event): void {
        this.removeMarkers();
        this.tooltipOptions.clientX = event.pixel.clientX;
        this.tooltipOptions.clientY = event.pixel.clientY;

        let unitRadius = 'm';
        let valueRadius = event.radius;
        if (valueRadius > 1000) {
            unitRadius = 'km';
            valueRadius = parseFloat(valueRadius);
            valueRadius = (valueRadius / 1000).toFixed(1);
        }

        this.tooltipOptions.title = valueRadius.toString();
        this.tooltipOptions.value = unitRadius;
        this.tooltipOptions.isShow = true;
        this.infoBoxOptions.isShow = false;
    }

    public circleRadiusComplete(event): void {
        this.tooltipOptions.isShow = false;
        this.infoBoxOptions.isShow = false;

        this.mapStateOptions.circle = {
            latitude: event.position.latitude,
            longitude: event.position.longitude,
            radius: event.radius,
        };
    }

    public circleRadiusMax() {
        this.tooltipOptions.isShow = false;
    }

    public circleRemove() {
        this.mapStateOptions.circle = null;

    }

    public changedDrawingMode(type): void {
        switch (type) {
            case DrawingModes.circle:
                this.mapOptions.defaultCursor = CursorType.crosshair;
                break;
            case DrawingModes.area:
                this.mapOptions.defaultCursor = CursorType.crosshair;
                break;
            case DrawingModes.marker:
                this.mapOptions.defaultCursor = CursorType.crosshair;
                break;
            case DrawingModes.fitBounds:
                this.mapOptions.defaultCursor = CursorType.crosshair;
                break;
            default:
                this.mapOptions.defaultCursor = CursorType.default;
                break;
        }
    }

    public zoomChangeMap(zoom): void {
    }

    public centerChangeMap(): void { }

    public mapMouseDrag(): void { this.infoBoxOptions.isShow = false; }

    public circleCenterChange(event): void {
        this.infoBoxOptions.isShow = false;
        this.mapStateOptions.circle = {
            latitude: event.position.latitude,
            longitude: event.position.longitude,
            radius: event.radius,
        };

        this.mapStateOptions.destinationMarker = {
            latitude: event.position.latitude,
            longitude: event.position.longitude,
        };
    }

    public markerDrawClick(event): void {

    }

    public markerDrawMouseOver(): void {
        this.infoBoxOptions.isShow = false;

    }

    public markerCreate(event): void {
        if (this.mapStateOptions.circle && !this.drawingOptions.isDraw) {
            this.drawingOptions.circleRadius = this.mapStateOptions.circle.radius;
            this.drawingOptions.circleFitBounds = this.mapStateOptions.circle.fitBounds;
        }

        this.mapStateOptions.destinationMarker = {
            latitude: event.latitude,
            longitude: event.longitude,
            fitBounds: false,
        };
        this.drawingOptions.markerFitBounds = false;
    }


    public areaCreate(positions): void {
        this.mapStateOptions.area = positions;
        this.mapOptions.defaultCursor = 'default';
    }

    public areaRemove(): void {
        this.mapStateOptions.area = null;
    }

    public markerRemove(): void {
        this.mapStateOptions.destinationMarker = null;
    }

    public circleCenterComplete(event): void {
        this.tooltipOptions.isShow = false;
        this.infoBoxOptions.isShow = false;
        this.mapStateOptions.circle = {
            latitude: event.position.latitude,
            longitude: event.position.longitude,
            radius: event.radius,
        };
    }

    public addMarkers(point): void {
        const marker: IMarker = {
            latitude: point.latitude,
            longitude: point.longitude,
            title: point.name,
            iconUrl: MarkerIcon.hotel,
            isCluster: true,
            address: point.address,
            typePoint: TypePoint.hotel,
            iconZIndex: 99,

        };
        this.markers.push(marker);
        this.markersFilter.push(marker);
    }

    public removeMarkers(): void {
        this.markers = [];
        this.routes = [];
    }

    public getByFilter(filter: any): Observable<any[]> {
        return this.http.post<IHotelGeneralInfo[]>(`${environment.apiHotelUrl}/HotelGeneralInfo/PostSearchMinimal`, filter)
            .pipe(pluck('items'));
    }

    public circleCreate(event): void {
        this.circleGeoJson(11, event.radius);

        // this.mapOptions.preloaderIsOpen = false;
        // this.mapOptions.defaultCursor = 'default';
        // this.getPointsRadius(event.position.latitude, event.position.longitude, event.radius);
        // this.mapStateOptions.circle = {
        //     latitude: event.position.latitude,
        //     longitude: event.position.longitude,
        //     radius: event.radius,
        //     fitBounds: false,
        // };
    }

    public getPointsRadius(latitude: number, longitude: number, radius: number): any {
        const url = `${environment.core.apiHotelUrl}HotelGeneralInfo/PostSearchMinimal`;
        const body: SearchMinimalRequest = new SearchMinimalRequest();
        body.filter = new SearchMin();
        body.filter.geoDistance = new GeoDistance();
        body.filter.geoDistance.centerPoint = new Position(latitude, longitude);
        body.filter.geoDistance.radius = radius;
        return this.http.post<ISearchMinimalResponse>(url, body).subscribe((dataSearch) => {
        }, () => {

        });
    }

    public circleGeoJson(zoom: number, radius: number) {
        const url = `${environment.core.apiHotelUrl}Test/GeoJsonSearch/GeoJsonSearch`;
        const body: SearchClusterJson = new SearchClusterJson();
        body.searchFilter = new SearchFilter();
        body.searchFilter.searchType = 'Circle';
        body.searchFilter.circle = new CircleGeoJson();
        body.searchFilter.circle.center = new Position(55.749750, 37.542581);
        body.searchFilter.circle.radius = radius;
        body.searchFilter.circle.radiusUnit = "m";
        body.aggregationFilter = new AggregationFilter();
        body.aggregationFilter.clusterMinCount = 2;
        body.aggregationFilter.precision = 'Precision13';
        return this.http.post<any>(url, body).subscribe((dataSearch) => {
            this.geoJsonObject = dataSearch;
            // this.cdr.detectChanges();

        }, () => {
        });
    }

}

export class SearchClusterJson {

    public searchFilter: SearchFilter;
    public aggregationFilter: AggregationFilter;

}


export class SearchFilter {

    public searchType: string;
    public circle: CircleGeoJson;

}

export class CircleGeoJson {

    public center: any;
    public radius: number;
    public radiusUnit: string;

}

// tslint:disable-next-line:max-classes-per-file
export class AggregationFilter {

    public precision: string;
    public clusterMinCount: number;

}


// tslint:disable-next-line:max-classes-per-file
export class SearchMinimalRequest {

    public filter: any;
    public take?: number;
    public skip?: number;

}

// tslint:disable-next-line:max-classes-per-file
export class Filter {

    public hotel: boolean;
    public airport: boolean;
    public favorite: boolean;
    public route: boolean;

}

export enum LocationType {
    pickUp = 'pickUp',
    dropDown = 'dropDown',
}

export interface IBoundar {
    regionName: string;
}

export interface IHotelGeneralInfo {
    latitude: number;
    longitude: number;
    ratings: IRating[];
    zipCode: string;
    countryIso: string;
    name: string;
    country: string;
    city: string;
    address: string;
    region: string;
    location: string;
    languageId: number;
    smallImage: ISmallImage;
    star?: number;
    isFavorite: boolean;
    id: number;
    amount?: string;
    currency?: string;
    supplierName?: string;
}

export interface IHotelLocationFilter {
    geoDistance: {
        centerPoint: {
            latitude: number;
            longitude: number;
        };
        radius: number;
    };
    requestId: string;
}

export interface IRating {
    value: number;
    image: IImage;
    type: any;
    hotelId: number;
    id: number;
}

export interface IImage {
    url: string;
    type: string;
    name: string;
    description: string;
    id: number;
}

export interface ISmallImage {
    fileName: string;
    fileHash: string;
    fileSize: number;
    fileUrl: string;
    fileStorageId: number;
    folderId: number;
    name: string;
    description: string;
    id: number;
}
// tslint:disable-next-line:max-classes-per-file


// tslint:disable-next-line:max-classes-per-file
export class SearchMin {

    public geoDistance: GeoDistance;
    public geoPolygon: GeoPolygon;
    public geoBoundingBox?: GeoBoundingBox;
    public nameContains?: string;
    public languageId?: number;
    public id: number;

}

// tslint:disable-next-line:max-classes-per-file
export class GeoDistance {

    public centerPoint: Position;
    public radius: number;
    public distanceUnit?: string;

}

// tslint:disable-next-line:max-classes-per-file
export class GeoPolygon {

    public points: Position[];
}


// tslint:disable-next-line:max-classes-per-file
export class GeoBoundingBox {

    public topLeftPoint: Position;
    public bottomRightPoint: Position;

}

export enum TypeSearchPoint {

    radius = 'radius',
    box = 'box',
    polygon = 'polygon',

}

export interface ISearchMinimalResponse {
    items: IPointMin[];
    count: number;
}

export interface IPointMin {
    name: string;
    address: string;
    country: string;
    city: string;
    countryIso: string;
    zipCode: string;
    region: string;
    id: number | string;
    languageId: number;
    location: string;
    latitude: number;
    longitude: number;
    ratings: any;
}

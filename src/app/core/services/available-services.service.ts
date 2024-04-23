import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';
import { IAppDetails } from '../../shared/interfaces/app-details.interface';
import { environment } from 'src/app/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AvailableServicesService {

    private _entity = 'ClientsAvailability';

    constructor(private _http: HttpClient) { }

    public getAvailableServices(): Observable<IAppDetails[]> {
        const params = new HttpParams().set('clientId', environment.auth.clientId);
        return this._http.get<IAppDetails[]>(`${environment.core.apiRootUrl}${this._entity}`, { params: params });
    }

}

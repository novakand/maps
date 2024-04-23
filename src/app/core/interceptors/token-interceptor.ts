import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import {
    OAuthResourceServerErrorHandler,
    OAuthService,
    OAuthStorage,
} from 'angular-oauth2-oidc';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {

    constructor(private storage: OAuthStorage,
        private oauthService: OAuthService,
        private errorHandler: OAuthResourceServerErrorHandler,
    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.oauthService.getAccessToken() || this.storage.getItem('access_token');
        const header = `Bearer ${token}`;

        const headers = req.headers.set('Authorization', header);

        req = req.clone({ headers });

        return next
            .handle(req)
            .pipe(catchError((err) => this.errorHandler.handleError(err)));
    }

}

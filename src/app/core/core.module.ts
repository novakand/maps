import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// external libs
import { AUTH_CONFIG, AuthConfig, OAuthModule, OAuthService } from 'angular-oauth2-oidc';

// modules
import { SharedModule } from '../shared';
import { H21StartPageModule } from '../components/h21-start-page/h21-start-page.module';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedModule,
        HttpClientModule,
        H21StartPageModule,
        OAuthModule.forRoot(),
    ],
    providers: [
        {
            provide: AUTH_CONFIG,
            useValue: environment.auth,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
    ],
    exports: [
        H21StartPageModule,
    ],
})
export class CoreModule {

    constructor(private oauthService: OAuthService,
        @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    ) {
        this._configureAuth();
    }

    private _configureAuth() {
        if (!!this.authConfig && !this.authConfig.loginUrl) {
            this.authConfig.loginUrl = `${this.authConfig.issuer}connect/authorize`;
        }
        if (!!this.authConfig && !this.authConfig.logoutUrl) {
            this.authConfig.logoutUrl = `${this.authConfig.issuer}connect/endsession`;
        }
        if (!!this.authConfig && !this.authConfig.userinfoEndpoint) {
            this.authConfig.userinfoEndpoint = `${this.authConfig.issuer}connect/userinfo`;
        }

        this.authConfig.oidc = true;
        this.oauthService.clientId = this.authConfig.clientId;
        this.oauthService.configure(this.authConfig);
        this.oauthService.setStorage(sessionStorage);
        this.oauthService.tryLogin();
    }

}

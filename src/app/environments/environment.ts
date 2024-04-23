import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: false,
    ssoUri: 'https://horse21pro.com/api/',

    auth: {
        issuer: 'https://id21pro-test2.azurewebsites.net/',
        clientId: 'maps-ui',
        scope: 'openid profile identityserver',
        redirectUri: `${window.location.origin}`,
        postLogoutRedirectUri: `${window.location.origin}`,
        silentRefreshRedirectUri: `${window.location.origin}/assets/silent-refresh.html`,
    },
    core: {
        apiRootUrl: 'https://h21-apps-api.azurewebsites.net/api/',
        apiHotelUrl: 'https://h21-hotels-be-api.azurewebsites.net/api/',
    },
};

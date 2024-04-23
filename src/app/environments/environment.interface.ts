import { AuthConfig } from 'angular-oauth2-oidc';

// interfaces
import { ICoreEnvironment } from './core-environment.interface';

export interface IEnvironment extends ICoreEnvironment {
    production: boolean;

    ssoUri: string;

    auth: AuthConfig;

    core: ICoreEnvironment;
}

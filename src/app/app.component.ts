import { ChangeDetectionStrategy, Component, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

// external libs
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Injectable()
export class AppComponent {

  public hasValidTokens: boolean;
  constructor(private _auth: OAuthService) {
    this._checkToken();
  }

  private _refreshToken(): void {
    this._auth.events
      .pipe(
        filter((e: any) => e.type === 'token_expires'),
      )
      .subscribe({
        next: () => {
          this._auth.silentRefresh()
            .then(() => this._auth.loadUserProfile().then(() => { }));
        },
      });
  }

  private _checkToken(): void {
    this.hasValidTokens = this._auth.hasValidIdToken() && this._auth.hasValidAccessToken();

    if (!this.hasValidTokens) {
      this._auth.initImplicitFlow();
      return;
    }

    this._refreshToken();
  }

}


export class SelectedGuildCache {
    static key = 'selected_guild';

    static get() {
        return localStorage.getItem(this.key);
    }

    static set(value) {
        localStorage.setItem(this.key, value);
    }

    static remove() {
        localStorage.removeItem(this.key);
    }
}

export class OauthToken {
    constructor(accessToken, expiresAt, refreshToken) {
        this.accessToken  = accessToken;
        this.expiresAt    = expiresAt;
        this.refreshToken = refreshToken;
    }

    static fromResponse(response) {
        let expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + response.expires_in);
        return new this(response.access_token, expiresAt, response.refresh_token);
    }
}

export class DiscordOauthTokenCache {
    static get() {
        let accessToken  = localStorage.getItem('access_token');
        let refreshToken = localStorage.getItem('refresh_token');
        let expiresAt    = new Date(localStorage.getItem('expires_at'));

        return new OauthToken(accessToken, expiresAt, refreshToken);
    }

    static set(value) {
        localStorage.setItem('access_token', value.accessToken);
        localStorage.setItem('refresh_token', value.refreshToken);
        localStorage.setItem('expires_at', value.expiresAt.toISOString());
    }

}
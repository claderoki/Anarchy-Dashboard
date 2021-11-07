import { AbstractCall } from '/@/helpers/base_api';

class DiscordCall extends AbstractCall {
    getAccessToken() {
        // let expires_at = localStorage.getItem('expires_at');
        // let refresh_token = localStorage.getItem('refresh_token');
        // TODO: check expires at and refresh token if needed.

        let access_token = localStorage.getItem('access_token');
        return access_token;
    }

    getBaseUri() {
        return 'https://discord.com/api';
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.getAccessToken());
        return headers;
    }
}

export class GetMe extends DiscordCall {
    getEndpoint() {
        return "/users/@me";
    }
}

export class GetGuilds extends DiscordCall {
    getEndpoint() {
        return "/users/@me/guilds";
    }
}

import { AbstractCall } from '/@/helpers/base_api';
import { DiscordOauthTokenCache } from '/@/helpers/cache';

class DiscordCall extends AbstractCall {
    constructor() {
        super();
        this.oauthToken = DiscordOauthTokenCache.get();
    }

    getBaseUri() {
        return 'https://discord.com/api';
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.oauthToken.accessToken);
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

import { AbstractCall } from '/@/helpers/base_api';

class AnarchyCall extends AbstractCall {
    getBaseUri() {
        return 'http://127.0.0.1:8080/api';
    }

    getHeaders() {
        return new Headers();
    }

    getAccessToken() {
        let access_token = localStorage.getItem('access_token');
        return access_token;
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.getAccessToken());
        return headers;
    }
}

export class SavePoll extends AnarchyCall {
    constructor(poll) {
        super();
        this.poll = poll;
    }

    getEndpoint() {
        return '/polls/save';
    }

    getHeaders() {
        let headers = super.getHeaders();
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    getBody() {
        return JSON.stringify(poll);
    }

    getMethod() {
        return 'POST';
    }
}

export class Authenticate extends AnarchyCall {
    constructor(code) {
        super();
        this.code = code;
    }

    getEndpoint() {
        return '/oauth/authenticate/' + this.code;
    }
}

export class GetOauthUrl extends AnarchyCall {
    getEndpoint() {
        return '/oauth/url';
    }

    getResponseType() {
        return 'TEXT';
    }
}

export class GetMutualGuilds extends AnarchyCall {
    getEndpoint() {
        return '/discord/get_mutual_guilds';
    }
}

export class GetPollSettings extends AnarchyCall {
    constructor(guild_id) {
        super();
        this.guild_id = guild_id;
    }

    getEndpoint() {
        return '/polls/' +this.guild_id + '/get_settings';
    }

}

export class GetPollAvailableChanges extends AnarchyCall {
    getEndpoint() {
        return '/polls/get_available_changes';
    }
}

export class GetAllTextChannels extends AnarchyCall {
    constructor(guild_id) {
        super();
        this.guild_id = guild_id;
    }

    getEndpoint() {
        return '/discord/'+this.guild_id+'/get_all_text_channels';
    }
}

export class GetAllRoles extends AnarchyCall {
    constructor(guild_id) {
        super();
        this.guild_id = guild_id;
    }

    getEndpoint() {
        return '/discord/'+this.guild_id+'/get_all_roles';
    }
}

export class GetAllMembers extends AnarchyCall {
    constructor(guild_id) {
        super();
        this.guild_id = guild_id;
    }

    getEndpoint() {
        return '/discord/'+this.guild_id+'/get_all_members';
    }
}
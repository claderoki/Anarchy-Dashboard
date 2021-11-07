import { AbstractCall } from '/@/helpers/base_api';

class AnarchyCall extends AbstractCall {
    getBaseUri() {
        return 'http://127.0.0.1:8080/api';
    }

    getHeaders() {
        return new Headers();
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

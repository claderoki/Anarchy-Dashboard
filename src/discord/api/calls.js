
class DiscordCall {
    getAccessToken() {
        // let expires_at = localStorage.getItem('expires_at');
        // let refresh_token = localStorage.getItem('refresh_token');
        // TODO: check expires at and refresh token if needed.

        let access_token = localStorage.getItem('access_token');
        return access_token;
    }

    getMethod() {
        return 'GET';
    }

    parseResponse(json) {
        return json;
    }

    call(onSuccess, onError) {
        let uri = 'https://discord.com/api' + this.getEndpoint();

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.getAccessToken());

        fetch(uri, {
            method: this.getMethod(),
            headers: headers
        }).then((response) => {
            response.json().then((json) => {
                onSuccess(this.parseResponse(json));
            });
        });
    }
}

export class GetMe extends DiscordCall {
    getEndpoint() {
        return "/users/@me";
    }
}

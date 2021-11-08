
export class AbstractCall {

    getMethod() {
        return 'GET';
    }

    parseResponse(json) {
        return json;
    }

    parseError(text) {
        return text;
    }

    getBody() {
        return null;
    }

    getResponseType() {
        return 'JSON';
    }

    call(onSuccess, onError) {
        let uri = this.getBaseUri() + this.getEndpoint();

        fetch(uri, {
            method: this.getMethod(),
            headers: this.getHeaders(),
            body: this.getBody(),
        }).then((response) => {
            if (!response.ok) {
                if (onError) {
                    response.text().then((text) => {
                        onError(this.parseError(text));
                    });
                }
            } else {
                switch (this.getResponseType()) {
                    case 'JSON':
                        response.json().then((json) => {
                            onSuccess(this.parseResponse(json));
                        });
                        break;
                    default:
                        response.text().then((text) => {
                            onSuccess(this.parseResponse(text));
                        });
                        break;
                }
            }
        });
    }
}
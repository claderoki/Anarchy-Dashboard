
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

    call() {
        let uri = this.getBaseUri() + this.getEndpoint();
        let self = this;

        return new Promise(function(resolve, reject) {
            fetch(uri, {
                method: self.getMethod(),
                headers: self.getHeaders(),
                body: self.getBody(),
            }).then((response) => {
                if (!response.ok) {
                    response.text().then((text) => {
                        reject(self.parseError(text));
                    });
                } else {
                    switch (self.getResponseType()) {
                        case 'JSON':
                            response.json().then((json) => {
                                resolve(self.parseResponse(json));
                            });
                            break;
                        default:
                            response.text().then((text) => {
                                resolve(self.parseResponse(text));
                            });
                            break;
                    }
                }
            });
          });
    }

}
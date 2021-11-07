<script setup>
import { reactive } from '@vue/reactivity';

function store_oauth(oauth_data) {
    let currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + oauth_data.expires_in)
    localStorage.setItem('access_token', oauth_data.access_token);
    localStorage.setItem('refresh_token', oauth_data.refresh_token);
    localStorage.setItem('expires_at', currentDate.toISOString()); // parse to datetime
}

let error = reactive({
    message:null,
    description:null,
});

let uri = window.location.search.substring(1);
let params = new URLSearchParams(uri);
let code = params.get('code');
if (code !== null) {
    fetch('http://127.0.0.1:8080/api/oauth/authenticate/' + code, {
        method: 'GET',
    }).then((response) => {
        response.json().then((json) => {
            if (response.ok) {
                store_oauth(json);
                window.open('/authenticated', '_self');
            } else {
                error.message = json.error;
                error.description = json.error_description;
            }
        });
    }).catch((reason) => {
        error.message = reason;
    });
}

</script>

<template>
    <h1 v-if="!error.message" id="anarchy-label">Authenticating...</h1>
    <div v-if="error.message">
        <h1 id="anarchy-label">Failed to authenticate...</h1>
        <h2 id="anarchy-label">Error: {{error.message}}</h2>
        <h3 id="anarchy-label">Description: {{error.description}}</h3>
    </div>

</template>
<script setup>
import { reactive } from '@vue/reactivity';
import { Authenticate } from '/@/api/calls';
import { OauthToken, DiscordOauthTokenCache } from '/@/helpers/cache';

function store_oauth(oauth_data) {
    DiscordOauthTokenCache.set(OauthToken.fromResponse(oauth_data));
}

let error = reactive({
    message:null,
    description:null,
});

let uri = window.location.search.substring(1);
let params = new URLSearchParams(uri);
let code = params.get('code');
if (code !== null) {
    new Authenticate(code).call().then((json) => {
        store_oauth(json);
        window.open('/authenticated', '_self');
    }).catch((error) => {
        error.message = error.message;
        error.description = error.description;
    });
}

</script>

<template>
    <h1 v-if="!error.message">Authenticating...</h1>
    <div v-if="error.message">
        <h1>Failed to authenticate...</h1>
        <h2>Error: {{error.message}}</h2>
        <h3>Description: {{error.description}}</h3>
    </div>

</template>
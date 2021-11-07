<script setup>

let authenticated = false;

let uri = window.location.search.substring(1); 
let params = new URLSearchParams(uri);
let code = params.get('code');
if (code !== null) {
    fetch('http://127.0.0.1:8080/api/oauth/authenticate/' + code, {
        method: 'GET',
    }).then((response) => {
        console.log('GOOD', response);
    }).catch((reason) => {
        console.log('BAD', reason);
    });
}

</script>

<template>
    <h1 v-if="authenticated" id="anarchy-label">You have been authenticated</h1>
    <h1 v-if="!authenticated" id="anarchy-label">Authenticating...</h1>
</template>
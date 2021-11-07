<script setup>



let uri = window.location.search.substring(1);
let params = new URLSearchParams(uri);
let code = params.get('code');
if (code !== null) {
    fetch('http://127.0.0.1:8080/api/oauth/authenticate/' + code, {
        method: 'GET',
    }).then((response) => {
        response.json().then((json) => {
            if (response.ok) {
                console.log('GOOD', json);
                window.open('/authenticated?' + Object.entries(json).map(e => e.join('=')).join('&'), '_self');
            } else {
                console.log('BAD', json);
            }
        });
    }).catch((reason) => {
        console.log('BAD', reason);
    });
}

</script>

<template>
    <h1 id="anarchy-label">Authenticating...</h1>
    <!-- <h1 id="anarchy-label">Failed to authenticate...</h1> -->
</template>
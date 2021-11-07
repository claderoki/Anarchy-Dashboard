<script setup>

let uri = window.location.search.substring(1);
let params = new URLSearchParams(uri);
// let code = params.get('code');

</script>

<template>
    <h1 id="anarchy-label">You are now authenticated. Welcome Clark.</h1>
</template>
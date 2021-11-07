<script setup>
import { GetMe } from '/@/discord/api/calls';
import { reactive } from '@vue/reactivity';

let me = reactive({
    id: null,
    username: null,
    discriminator: null,
    avatar: null,
});

new GetMe().call((response) => {
    me.id            = response.id;
    me.username      = response.username;
    me.discriminator = response.discriminator;
    me.avatar        = response.avatar;
});

</script>

<template>
    <h1 id="anarchy-label">You are now authenticated.</h1>
    <h1 v-if="me.username" id="anarchy-label">Welcome {{me.username}}#{{me.discriminator}}.</h1>

</template>
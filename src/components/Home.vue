<script setup>
import { GetOauthUrl } from '/@/api/calls';

let cached_url = null;
function open_url() {
  if (cached_url === null) {
    new GetOauthUrl().call().then((url) => {
      cached_url = url;
      window.open(cached_url, '_self');
    });
  } else {
    window.open(cached_url, '_self');
  }
}

</script>

<template>
  <anarchy-block title="Dashboard for the Anarchy Discord bot">
    <button class="btn btn-outline-primary" @click="open_url();" type="button">Authenticate now</button>
  </anarchy-block>
</template>
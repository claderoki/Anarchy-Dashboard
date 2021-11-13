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
  <div class="container py-4">
    <div class="h-100 p-5 text-white bg-dark rounded-3">
      <h2>Dashboard for the Anarchy Discord bot</h2>
      <p>Text</p>
      <button class="btn btn-primary" @click="open_url();" type="button">Authenticate now</button>
    </div>
  </div>
</template>
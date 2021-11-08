<script setup>

import { ref, reactive } from 'vue';
import { GetMutualGuilds } from '/@/api/calls';

let mutualGuildsCalled = false;
let mutualGuilds = reactive([]);

let data = reactive({
  selectedGuild: localStorage.getItem('selected_guild')
});

if (!mutualGuildsCalled) {
  new GetMutualGuilds().call((response) => {
    for (let guild of response) {
      mutualGuilds.push(guild);
    }
    mutualGuildsCalled = true;
  });
}

function onGuildSelect() {
  localStorage.setItem('selected_guild', data.selectedGuild);
}

if (data.selectedGuild === null) {
  data.selectedGuild = '';
}

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark" id="anarchy-topbar">
    <a class="navbar-brand">Anarchy</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#anarchy-topbar-links" aria-controls="anarchy-topbar-links" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="anarchy-topbar-links">
      <div class="navbar-nav">
        <router-link class="nav-item nav-link" to="/home">Home</router-link>
        <router-link class="nav-item nav-link" to="/polls">Polls</router-link>
      </div>
    </div>
    <div>
      <select id="anarchy-form-select" v-model="data.selectedGuild" @change="onGuildSelect();" class="form-select" required>
        <option disabled value>---Select a guild---</option>
        <option v-for="guild in mutualGuilds" :value="guild['id']">{{ guild['name'] }}</option>
      </select>
    </div>
  </nav>
  <div>
    <div class="container">
      <main>
        <div class="row">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>

import { ref, reactive } from 'vue';
import { GetMutualGuilds } from '/@/api/calls';
import { GetMe } from '/@/discord/api/calls';
import { SelectedGuildCache } from '/@/helpers/cache';
import Loader from '/@/components/Loader.vue';

let mutualGuilds = reactive([]);

let data = reactive({
  selectedGuild:      SelectedGuildCache.get(),
  mutualGuildsCalled: false
});

if (!data.mutualGuildsCalled) {
  new GetMutualGuilds().call().then((response) => {
    let containsSelected = false;
    for (let guild of response) {
      mutualGuilds.push(guild);
      if (guild.id == SelectedGuildCache.get()) {
        containsSelected = true;
      }
    }
    if (!containsSelected) {
      SelectedGuildCache.remove();
    }
    data.mutualGuildsCalled = true;
  });
}

function onGuildSelect() {
  SelectedGuildCache.set(data.selectedGuild);
}

if (data.selectedGuild === null) {
  data.selectedGuild = '';
}

class UserDetailsCache {
  static getCached() {
    let avatar = localStorage.getItem('user_details_avatar');
    let username = localStorage.getItem('user_details_username');
    let discriminator = localStorage.getItem('user_details_discriminator');
    let id = localStorage.getItem('user_details_id');
    
    if (avatar === null || username === null || id === null || discriminator === null) {
      return null;
    }

    return {
      id: id,
      avatar: avatar,
      username: username,
      discriminator: discriminator,
    }
  }

  static cache(details) {
    localStorage.setItem('user_details_id', details.id);
    localStorage.setItem('user_details_avatar', details.avatar);
    localStorage.setItem('user_details_username', details.username);
    localStorage.setItem('user_details_discriminator', details.discriminator);
  }
}
let me = reactive({});
me = UserDetailsCache.getCached();
if (me === null) {
    me = reactive({});
    new GetMe().call().then((response) => {
      me.avatar = response.avatar;
      me.id = response.id;
      me.username = response.username;
      me.discriminator = response.discriminator;
      UserDetailsCache.cache(response);
    });
}

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="anarchy-topbar">
    <a class="navbar-brand">Anarchy</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#anarchy-topbar-links" aria-controls="anarchy-topbar-links" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="anarchy-topbar-links">
      <div class="navbar-nav">
        <router-link class="nav-item nav-link" to="/home">Home</router-link>
        <router-link v-if="data.selectedGuild !== ''" class="nav-item nav-link" to="/poll/create">Create a poll</router-link>
        <router-link v-if="data.selectedGuild !== ''" class="nav-item nav-link" to="/poll/settings">Poll settings</router-link>
      </div>
    </div>
    <div>
      <select v-model="data.selectedGuild" @change="onGuildSelect();" class="form-select" required>
        <option disabled value>---Select a guild---</option>
        <option v-for="guild in mutualGuilds" :value="guild['id'].toString()" v-bind:key="guild['id'].toString()">{{ guild['name'] }}</option>
      </select>
    </div>
    <div id="anarchy-topbar-avatar">
      <img id="anarchy-topbar-avatar-img" :src="'https://cdn.discordapp.com/avatars/'+ me.id + '/' + me.avatar + '.png?size=64'"/>
      <div id="anarchy-topbar-avatar-username-container">
        <label id="anarchy-topbar-avatar-username-title">{{me.username}}</label>
        <label id="anarchy-topbar-avatar-username-subtitle">{{'#' + me.discriminator}}</label>
      </div>
    </div>
  </nav>
  <div v-if="!data.mutualGuildsCalled">
    <Loader/>
  </div>
  <div v-if="data.mutualGuildsCalled">
    <div class="container">
      <main>
        <div class="row">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

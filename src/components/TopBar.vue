<script setup>
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark" id="anarchy-topbar">
    <a class="navbar-brand">Anarchy</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#anarchy-topbar-links"
      aria-controls="anarchy-topbar-links"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="anarchy-topbar-links">
      <div class="navbar-nav">
        <router-link class="nav-item nav-link" to="/home">Home</router-link>
        <router-link class="nav-item nav-link" to="/polls">Polls</router-link>
      </div>
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

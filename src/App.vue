<script setup>
import TopBar from '/@/components/TopBar.vue'
</script>

<template>
  <TopBar />
</template>

<style lang="scss">
@import "/@/scss/custom.scss";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#anarchy-form-row {
  display: flex;
  align-items: center;
}
#anarchy-table {
  width: 100%;
}
#anarchy-topbar {
  padding-left: 10px;
  padding-right: 10px;
}
#anarchy-form-block {
  background-color: $gb_dark0_soft;
  padding-bottom: 15px;
}
#anarchy-form-block-column {
  margin-top: 0;
}
#anarchy-form-block-title {
  color: $gb_faded_aqua;
}
#anarchy-form-block-subtitle {
  font-size: 75%;
  font-style: italic;
  margin-top: 0;
}
#anarchy-topbar-avatar {
  display: flex;
  justify-content: center;
  margin-left:5px;
}
#anarchy-topbar-avatar-img {
  margin: auto;
  border-radius: 50%;
  height: 32px;
  width: 32px;
}
#anarchy-topbar-avatar-username-container {
  float:right;
  margin-left:5px;
}
#anarchy-topbar-avatar-username-title {
  text-align: center;
}
#anarchy-topbar-avatar-username-subtitle {
  font-size: 11px;
  color: $gb_gray_244;
  display: block;
}
#anarchy-modal-footer {
  border-top: 0;
}
#anarchy-pagination {
  padding-left: 1.5em;
}

</style>

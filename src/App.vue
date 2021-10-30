<script setup>
import TopBar from './components/TopBar.vue'
</script>

<template>
  <TopBar />
</template>

<style lang="scss">
@import "./scss/gruvbox_colors.scss";
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: $gb_dark0;
}
:root {
  background-color: $gb_dark0;
}
$border_color: black;
$border_size: 0;

#anarchy-form-row {
  display: flex;
  align-items: center;
}
#anarchy-table {
  width: 100%;
}
#anarchy-label {
  color: $gb_light0;
  text-align: center;
}
#anarchy-form {
  background-color: $gb_dark0_hard;
  border-color: $border_color;
  border: $border_size;
  color: $gb_light0;
}
#anarchy-form:focus {
  box-shadow: 0 0 0 0.05rem $gb_bright_blue;
}
#anarchy-form::placeholder {
  color: $gb_dark2;
}
#anarchy-form-select {
  background-color: $gb_dark0_hard;
  border-color: $border_color;
  border: $border_size;
  color: $gb_light0;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23fbf1c7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
}
#anarchy-form-select:focus {
  box-shadow: 0 0 0 0.05rem $gb_bright_blue;
}
#anarchy-form-select:invalid {
  background-color: $gb_dark0_hard;
  color: $gb_dark2;
}
#anarchy-form:disabled {
  background-color: $gb_dark0_hard;
  color: $gb_dark2;
}
#anarchy-topbar-links {
  background-color: $gb_dark0_hard;
  color: $gb_dark2;
}
#anarchy-topbar {
  background-color: $gb_dark0_hard;
  color: $gb_dark2;
}
#anarchy-info-box {
  color: $gb_light0;
}
#anarchy-info-box-content {
  background-color: $gb_dark0_hard;
}
#anarchy-form-block {
  background-color: $gb_dark0_soft;
  padding-bottom: 15px;
}
#anarchy-form-block-column {
  margin-top: 0;
}
#anarchy-form-block-title {
  padding-top: 10px;
  color: $gb_faded_aqua;
  margin-top: 0;
  font-size: 150%;
}
#anarchy-form-block-subtitle {
  color: $gb_light0;
  font-size: 75%;
  font-style: italic;
  margin-top: 0;
}
#anarchy-form-row-seperator {
  color: $gb_light0;
}
#anarchy-button-green {
  color: $gb_faded_aqua;
  border-color: $gb_faded_aqua;
}
#anarchy-button-green:hover {
  color: $gb_light0;
  border-color: $gb_faded_aqua;
  background-color: $gb_faded_aqua;
}

</style>

<script setup>
defineProps({
  check: Boolean,
});
</script>

<template>
  <div>
    <label class="switch">
      <input type="checkbox"/>
      <span class="slider"></span>
    </label>
  </div>
</template>

<style lang="scss">
  @import "./../scss/slider.scss";
</style>
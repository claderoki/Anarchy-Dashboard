<script setup>
defineProps({
  title: String,
  subtitle: String,
})
</script>

<template>
  <div class="row g-5" id="anarchy-form-block">
    <label id="anarchy-form-block-title">
      {{title}}
    </label>
    <label id="anarchy-form-block-subtitle">
      {{subtitle}}
    </label>
    <div class="col" id="anarchy-form-block-column">
      <slot></slot>
      <hr class="my-2" id="anarchy-form-row-seperator"/>
    </div>
  </div>
</template>
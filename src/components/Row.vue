<script setup>
import InfoBox from './InfoBox.vue';
defineProps({
  label: String,
  explanation: String,
})
</script>

<template>
  <hr class="my-2" id="anarchy-form-row-seperator"/>
  <div class="row" id="anarchy-form-row">
    <div class="col-sm-3">
      <label id="anarchy-label">
        {{ label }}
      </label>
    </div>
    <div class="col-sm-9">
      <slot></slot>
    </div>
  </div>
</template>
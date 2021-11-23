<script setup>
defineProps({
  label: String,
  explanation: String,
})
</script>

<template>
  <hr class="my-2"/>
  <div class="row" id="anarchy-form-row">
    <div class="col-sm-3">
      <label>
        {{ label }}
      </label>
    </div>
    <div class="col-sm-9">
      <slot></slot>
    </div>
  </div>
</template>
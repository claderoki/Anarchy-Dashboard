<script setup>
  defineProps({
    selected: String,
    options: Array,
    name: String,
    firstOption: String
  })
</script>

<template>
    <div class="col-md-5">
      <label for="{{ name }}" class="form-label">Channel</label>
      <select class="form-select" id="{{ name }}" name="{{ name }}" required>
          <option value selected="selected">---Select a channel---</option>
          <option>General</option>
          <option>Bot-Spam</option>
      </select>
      <div class="invalid-feedback">Please select a channel.</div>
    </div>
</template>

<style scoped>
</style>

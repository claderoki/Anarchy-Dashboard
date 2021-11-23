<script setup>
defineProps({
  title: String,
  subtitle: String,
})
</script>



<template>
  <div class="container py-5">
    <div class="h-100 p-5 text-white bg-dark rounded-3">
      <h2 id="anarchy-form-block-title">{{title}}</h2>
      <p  id="anarchy-form-block-subtitle">{{subtitle}}</p>
      <slot></slot>
    </div>
  </div>
</template>
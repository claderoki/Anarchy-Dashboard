<script setup>
defineProps({
  maxItemsPerPage: Number,
  items: Array,
})

</script>

<template>
    <nav aria-label="...">
      <ul class="pagination pagination-sm">
        <li class="page-item active" aria-current="page"><a class="page-link">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
      </ul>
    </nav>
</template>

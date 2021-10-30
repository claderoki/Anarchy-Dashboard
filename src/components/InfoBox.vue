<script setup>
defineProps({
  info: String,
})
</script>

<template>
  <button class="fa fa-info btn btn-sm btn-primary rounded-pill" aria-hidden="true" data-bs-toggle="modal" data-bs-target="#anarchy-info-box">
  </button>

<div class="modal fade" id="anarchy-info-box" tabindex="-1" aria-labelledby="anarchy-info-box-title" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" id="anarchy-info-box-content">
      <div class="modal-header">
        <h5 class="modal-title" id="anarchy-info-box-title"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        {{info}}
      </div>
    </div>
  </div>
</div>

</template>
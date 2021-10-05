<script setup>
import Selector from './Selector.vue';
</script>

<template>
  <div class="container">
    <main>
      <div class="py-5 text-center">
        <h2>Checkout form</h2>
        <p class="lead">
          Below is an example form built entirely with
          Bootstrap’s form controls. Each required form group has a validation
          state that can be triggered by attempting to submit the form without
          completing it.
        </p>
      </div>

      <div class="row g-5">
        <div class="col-md-7 col-lg-8">
          <h4 class="mb-3">Poll</h4>
          <form class="needs-validation was-validated" novalidate>
            <div class="row g-3">
              <div class="col-sm-6">
                <label for="question" class="form-label">Question</label>
                <input type="text" class="form-control" id="question" placeholder required />
                <div class="invalid-feedback">Question is required.</div>
              </div>

              <div class="col-sm-6">
                <div class="col-md-8">
                  <label for="option_type" class="form-label">Type</label>
                  <select class="form-select" id="option_type" name="option_type" required>
                    <option value="bool" selected="selected">Yes / No</option>
                    <option value="custom">Choose your own</option>
                  </select>
                  <div class="invalid-feedback">Please select a channel.</div>
                </div>
              </div>

              <!-- <label>
                  <input type="checkbox" value="remember-me"> Remember me
              </label>-->

              <hr class="my-4" />

              <div class="col-12">
                <label for="options" class="form-label">Options</label>
              </div>

              <div class="col-md-5">
                <label for="channel_id" class="form-label">Channel</label>
                <select class="form-select" id="channel_id" name="channel_id" required>
                  <option value selected="selected">---Select a channel---</option>
                  <option>General</option>
                  <option>Bot-Spam</option>
                </select>
                <div class="invalid-feedback">Please select a channel.</div>
              </div>

              <div class="col-md-5">
                <label for="channel_id" class="form-label">Result channel</label>
                <select class="form-select" id="channel_id" name="channel_id" required>
                  <option value selected="selected">---Select a channel---</option>
                  <option>General</option>
                  <option>Bot-Spam</option>
                </select>
                <div class="invalid-feedback">Please select a channel.</div>
              </div>
            </div>

            <hr class="my-4" />

            <button class="w-100 btn btn-primary btn-lg" type="submit">Start</button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

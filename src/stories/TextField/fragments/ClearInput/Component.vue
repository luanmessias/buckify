<template>
  <div @click="setClearInput">
    <ClearIcon />
  </div>
</template>

<script lang="ts" setup>
  import ClearIcon from './assets/ClearIcon.vue';

  const emit = defineEmits(['clearInput'])

  const setClearInput = () => {
    emit('clearInput')
  }
</script>
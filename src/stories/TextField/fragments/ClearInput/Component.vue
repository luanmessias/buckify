<template>
  <div @click="setClearInput">
    <SvgIcon name="close" size="md" stroke-width="2" stroke-color="text-neutral-300" />
  </div>
</template>

<script lang="ts" setup>
  import SvgIcon from '@Stories/SvgIcon'

  const emit = defineEmits(['clearInput'])

  const setClearInput = () => {
    emit('clearInput')
  }
</script>

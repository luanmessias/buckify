<template>
  <div @click="togglePasswordDisplay">
    <SvgIcon
      v-if="props.type === 'text'"
      name="eye-on"
      size="md"
      stroke-width="2"
      stroke-color="text-neutral-300"
    />
    <SvgIcon v-else name="eye-off" size="md" stroke-width="2" stroke-color="text-neutral-300" />
  </div>
</template>

<script lang="ts" setup>
  import SvgIcon from '@Stories/SvgIcon'

  const props = defineProps({
    type: {
      type: String,
      required: true,
      options: ['password', 'text']
    }
  })

  const emit = defineEmits(['togglePasswordDisplay'])

  const togglePasswordDisplay = () => {
    emit('togglePasswordDisplay')
  }
</script>

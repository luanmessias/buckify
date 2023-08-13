<template>
  <div  @click="togglePasswordDisplay">
    <EyeOnIcon v-if="props.type === 'text'" />
    <EyeOffIcon v-else />
  </div>
</template>

<script lang="ts" setup>
  import EyeOffIcon from './assets/EyeOff.vue';
import EyeOnIcon from './assets/EyeOn.vue';

  const props = defineProps({
    type: {
      type: String,
      required: true,
      options: ['password', 'text']
    },
  })

  const emit = defineEmits(['togglePasswordDisplay'])

  const togglePasswordDisplay = () => {
    emit('togglePasswordDisplay')
  }

</script>
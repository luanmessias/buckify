<template>
    <button 
      :type="type"
      :class="`${styles.base} ${selectedTheme} ${selectedSize}`" 
      :theme="theme"
      :size="size"
      @click="onClick" 
    >
      {{ label }}
    </button>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps<{
    label: string;
    type: 'button' | 'submit' | 'reset';
    theme: 'primary' | 'secondary';
    size: 'small' | 'medium' | 'large';
    onClick: () => void;
  }>();

  const styles = {
    base: 'flex items-center justify-center rounded-md text-sm h-14',
    theme: {
      primary: 'bg-primary-500 hover:bg-primary-700 text-white',
      secondary: 'bg-gray-500 hover:bg-gray-700 text-white',
    },
    size: {
      small: 'w-20',
      medium: 'w-40',
      large: 'w-60',
      full: 'w-full',
    },
  };


  const selectedTheme = computed(() => {
    const theme = props.theme as keyof typeof styles.theme;
    return styles.theme[theme];
  });

  const selectedSize = computed(() => {
    const size = props.size as keyof typeof styles.size;
    return styles.size[size];
  });

</script>
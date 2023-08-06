<template>
  <RouterLink
    v-if="to && !disabled"
    :to="to"
    :type="type"
    :class="`${styles.base} ${selectedTheme} ${selectedSize}`"
    :theme="theme"
    :size="size"
  >
    <slot />
    {{ label }}
  </RouterLink>
  <button
    v-else-if="!to && !disabled"
    :type="type"
    :class="`${styles.base} ${selectedTheme} ${selectedSize}`"
    :theme="theme"
    :size="size"
    @click="onClick"
  >
    <slot />
    {{ label }}
  </button>
  <div
    v-else
    :class="`${styles.base} ${styles.theme.disabled} ${selectedSize}`"
    :size="size"
  >
    <slot />
    {{ label }}
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
import { RouterLink } from 'vue-router';

  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    type: {
      type: String as () => 'button' | 'submit' | 'reset',
      default: 'button'
    },
    theme: {
      type: String as () => 'primary' | 'secondary' | 'disabled',
      default: 'primary'
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
    },
    onClick: {
      type: Function as unknown as () => () => void
    }
  })

  const styles = {
    base: 'flex items-center justify-center gap-1 rounded-md text-sm h-14 transition-colors duration-200 ease-in-out',
    theme: {
      primary: 'bg-primary-500 hover:bg-primary-700 text-white',
      secondary: 'bg-white hover:bg-gray-200 text-neutral-500 border border-neutral-100',
      disabled: 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
    },
    size: {
      small: 'w-20',
      medium: 'w-40',
      large: 'w-60',
      full: 'w-full'
    }
  }

  const selectedTheme = computed(() => {
    const theme = props.theme as keyof typeof styles.theme
    return styles.theme[theme]
  })

  const selectedSize = computed(() => {
    const size = props.size as keyof typeof styles.size
    return styles.size[size]
  })
</script>

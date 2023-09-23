<template>
  <component
    :is="icon"
    :width="iconSize"
    :height="iconSize"
    :stroke-width="strokeWidth"
    :class="[
      color ? `fill-current ${color}` : ``,
      strokeColor ? `stroke-current ${strokeColor}` : ``,
      cssClass ? cssClass : ``
    ]"
  />
</template>

<script lang="ts" setup>
  import { computed, defineAsyncComponent } from 'vue'
  import resolveConfig from 'tailwindcss/resolveConfig'
  import tailwindConfig from '@TailwindConfig'

  const fullConfig = resolveConfig(tailwindConfig)

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md'
    },
    strokeWidth: {
      type: Number,
      default: 0
    },
    strokeColor: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    cssClass: {
      type: String,
      default: ''
    }
  })

  const iconSize = computed(() => {
    const sizeMapping: Record<string, string> = fullConfig.theme.icon.size

    return sizeMapping[props.size] || sizeMapping['md']
  })

  const icon = defineAsyncComponent(() => import(`../../assets/svg/${props.name}.svg.vue`))
</script>

<template>
  <div
    :class="[
      `checkbox flex items-center w-fit`,
      disabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @click="toggleCheckbox"
  >
    <div :class="[`relative`]">
      <input
        v-model="checked"
        type="checkbox"
        :class="[`hidden absolute w-full h-full`]"
        :aria-label="props.label"
        :disabled="props.disabled"
      />
      <transition name="checkbox-transition" mode="out-in">
        <template v-if="checked">
          <div class="relative">
            <CheckboxCheckedIcon
              :class="[
                props.size === 'small' ? 'scale-75' : '',
                props.size === 'large' ? 'scale-125' : ''
              ]"
            />
          </div>
        </template>
        <template v-else>
          <div class="relative">
            <CheckboxIcon
              :class="[
                props.size === 'small' ? 'scale-75' : '',
                props.size === 'large' ? 'scale-125' : ''
              ]"
            />
          </div>
        </template>
      </transition>
    </div>
    <label
      v-if="props.label"
      for="checkbox"
      :class="[
        ` text-neutral-500 select-none`,
        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        props.error ? 'text-red-500' : '',
        props.size === 'small' ? 'ml-1 text-xxs' : '',
        props.size === 'medium' ? 'ml-2 text-xs' : '',
        props.size === 'large' ? 'ml-2.5 text-s' : ''
      ]"
    >
      {{ props.label }}
      <span
        v-if="props.required"
        :class="['required-label font-bold', props.error ? 'text-red-500' : 'text-neutral-500']"
        v-text="'*'"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import CheckboxIcon from '@Assets/svg/checkbox.svg.vue'
  import CheckboxCheckedIcon from '@Assets/svg/checkbox-checked.svg.vue'

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium'
    },
    error: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    }
  })

  const checked = ref(props.checked)

  const emits = defineEmits(['update:checked'])

  const toggleCheckbox = () => {
    if (!props.disabled) {
      checked.value = !checked.value
      emits('update:checked', checked.value)
    }
  }
</script>

<style scoped>
  .checkbox-transition-enter-active,
  .checkbox-transition-leave-active {
    transition:
      opacity 0.3s,
      transform 0.3s;
  }

  .checkbox-transition-enter,
  .checkbox-transition-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
</style>

<template>
  <div
    :class="[
      `select flex flex-col relative h-12 rounded-md border bg-secondary-50 p-3 cursor-pointer`,
      props.error ? 'border-red-500' : 'border-secondary-100',
      props.size === 'small' && 'w-40',
      props.size === 'medium' && 'w-60',
      props.size === 'large' && 'w-80',
      props.size === 'full' && 'w-full'
    ]"
  >
    <input type="hidden" :id="id" v-model="selectedOption" />
    <label
      :for="id"
      :class="[
        `absolute left-3 top-1/2 -translate-y-1/2 text-x transition-all`,
        `text-neutral-200 cursor-text`,
        `peer-focus:text-xxs peer-focus:-translate-y-5`,
        selectedOption && `text-xxs -translate-y-5 text-neutral-500`,
        props.error && `text-red-500`
      ]"
    >
      {{ label }}
      <span v-if="required" class="font-bold" v-text="'*'" />
    </label>
    <span
      v-if="props.feedback"
      :class="[
        `feedback absolute text-xxs text-neutral-200 left-3 top-1/2 opacity-0 transition-all`,
        props.error && `text-red-500 translate-y-6 opacity-100`
      ]"
      v-text="props.feedback"
    />
    <ArrowIcon :class="[`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`]" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import ArrowIcon from './assets/ArrowIcon.vue'

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large' | 'full',
      default: 'medium'
    },
    error: {
      type: Boolean,
      default: false
    },
    feedback: {
      type: String
    },
    options: {
      type: Array as () => string[],
      default: () => []
    }
  })

  const selectOptions = ref(props.options)
  const selectedOption = ref('')

  const emits = defineEmits(['setSelectOption'])

  const setSelectOption = (event: Event) => {
    const target = event.target as HTMLSelectElement
    selectedOption.value = target.value
    emits('setSelectOption', selectedOption.value)
  }
</script>

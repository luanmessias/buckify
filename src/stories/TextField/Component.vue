<template>
  <div
    :class="[
      `text-input flex flex-col relative rounded-md border bg-secondary-50 p-3`,
      props.error ? 'border-red-500' : 'border-secondary-100',
      props.size === 'small' && 'w-40',
      props.size === 'medium' && 'w-60',
      props.size === 'large' && 'w-80',
      props.size === 'full' && 'w-full',
      showClear || (showEye && 'pr-12')
    ]"
  >
    <input
      :id="id"
      :type="inputType"
      :class="[`bg-transparent text-sm peer`]"
      v-model="textInput"
      v-bind="$attrs"
      @input="setFieldValue"
    />
    <label
      :for="id"
      :class="[
        `absolute left-3 top-1/2 -translate-y-1/2 text-x transition-all`,
        `text-neutral-200 cursor-text`,
        `peer-focus:text-xxs peer-focus:-translate-y-5`,
        textInput && `text-xxs -translate-y-5 text-neutral-500`,
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
    <PasswordToggle
      v-if="showEye"
      @toggle-password-display="togglePasswordDisplay"
      :type="inputType"
      :class="[`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`]"
    />
    <ClearInput
      v-if="showClear && textInput && !showEye"
      @clear-input="textInput = ''"
      :class="[`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`]"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import ClearInput from './fragments/ClearInput'
  import PasswordToggle from './fragments/PasswordToggle'

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
    type: {
      type: String as () => 'text' | 'password' | 'email' | 'number' | 'tel' | 'url',
      default: 'text'
    },
    showEye: {
      type: Boolean,
      default: false
    },
    fieldValue: {
      type: String,
      default: ''
    },
    showClear: {
      type: Boolean,
      default: false
    }
  })

  const textInput = ref('')
  const inputType = ref(props.type)

  const togglePasswordDisplay = () => {
    inputType.value = inputType.value === 'password' ? 'text' : 'password'
  }

  const emits = defineEmits(['setFieldValue'])

  const setFieldValue = () => {
    emits('setFieldValue', textInput.value)
  }
</script>

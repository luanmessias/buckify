<template>
  <div 
    :class="`
      ${styles.base.default}
      ${selectedSize}
      ${props.error ? styles.base.error : ''}
      ${showEye ? styles.base.password : ''}
    `"
  >
    <input 
      :id="id"
      :type="inputType"
      :class="`${styles.input}`"
      v-model="textInput"
    />
    <label 
      :for="id" 
      :class="`
        ${styles.label.default}
        ${textInput ? styles.label.active : ''}
        ${props.error ? styles.label.error : ''}
      `"
    > 
      {{ label }}
      <span 
        v-if="required"
        class="font-bold"
        v-text="'*'"
      />
    </label>
    <span
      v-if="props.feedback"
      :class="`
        ${styles.feedback.default}
        ${props.error && styles.feedback.error}
      `"
      v-text="props.feedback"
    />
    <PasswordToggle
      v-if="showEye"
      @toggle-password-display="togglePasswordDisplay"
      :type="inputType"
      :class="`${styles.password.default}`"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
import PasswordToggle from './fragments/PasswordToggle';
  
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
      type: String,
      default: 'asdasdasda'
    },
    type: {
      type: String,
      default: 'text'
    },
    showEye: {
      type: Boolean,
      default: false
    }
  });

  const textInput = ref('');
  const inputType = ref(props.type);

  const styles = {
    base: {
      default: 'flex flex-col relative rounded-md border border-transparent bg-secondary-50 p-3',
      error: 'border-red-500',
      password: 'pr-10'
    },
    input: 'bg-transparent text-sm peer',
    label: {
      default: 'absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-200 cursor-text peer-focus:text-xxs peer-focus:-translate-y-5 transition-all',
      active: 'text-xxs -translate-y-5 text-neutral-500',
      error: 'text-red-500'
    },
    size: {
      small: 'w-40',
      medium: 'w-60',
      large: 'w-80',
      full: 'w-full'
    },
    feedback: {
      default: 'absolute text-xxs text-neutral-200 left-3 top-1/2 opacity-0 transition-all',
      error: 'text-red-500 translate-y-6 opacity-100'
    },
    password: {
      default: 'absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
    }
  };

  const selectedSize = computed(() => {
    const size = props.size as keyof typeof styles.size
    return styles.size[size]
  })

  const togglePasswordDisplay = () => {
    inputType.value = inputType.value === 'password' ? 'text' : 'password';
  }
</script>
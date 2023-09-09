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
    @click="toggleOptions"
  >
    <input
      type="text"
      :id="id"
      :class="['selected cursor-pointer bg-transparent']"
      v-model="selectedOptionLabel"
      readonly
    />
    <label
      :for="id"
      :class="[
        `absolute left-3 top-1/2 -translate-y-1/2 text-x transition-all`,
        `text-neutral-200 cursor-text`,
        `peer-focus:text-xxs peer-focus:-translate-y-5`,
        (selectedOption !== '' || showOptions) && `text-xxs -translate-y-5 text-neutral-500`,
        props.error && `text-red-500`
      ]"
    >
      {{ label }}
      <span v-if="required" class="required-label font-bold" v-text="'*'" />
    </label>
    <span
      v-if="props.feedback"
      :class="[
        `feedback absolute text-xxs text-neutral-200 left-3 top-1/2 opacity-0 transition-all`,
        props.error && `text-red-500 translate-y-6 opacity-100`
      ]"
      v-text="props.feedback"
    />
    <ArrowIcon
      :class="[
        `absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`,
        showOptions && `transform rotate-180`
      ]"
    />
    <transition name="options">
      <ul
        v-if="showOptions"
        :class="[
          `select__options absolute overflow-y-auto overflow-x-hidden h-auto left-0 top-12 w-full`,
          `bg-secondary-50 border border-secondary-100 rounded-md`,
          `max-h-40`
        ]"
      >
        <li
          v-if="selectOptions.length === 0"
          class="select__option h-12 flex items-center px-3 cursor-pointer text-neutral-500 text-xs"
          v-text="'No options'"
        />
        <li
          v-else
          v-for="option in selectOptions"
          :key="option.id"
          :class="[
            `select__option h-10 flex items-center px-3 cursor-pointer text-xs text-neutral-500`,
            `hover:bg-secondary-100 hover:text-secondary-500`,
            selectedOption === option.id && `bg-secondary-200 text-secondary-500`
          ]"
          @click="setSelectOption(option)"
          v-text="option.label"
        />
      </ul>
    </transition>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import ArrowIcon from './assets/ArrowIcon.vue'

  type OptionType = {
    id: string
    label: string
  }

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
      type: Array as () => OptionType[],
      default: () => []
    }
  })

  const selectOptions = ref(props.options)
  const selectedOption = ref('')
  const showOptions = ref(false)

  const selectedOptionLabel = computed(() => {
    const option = selectOptions.value.find((option) => option.id === selectedOption.value)
    return option ? option.label : ''
  })

  const toggleOptions = () => {
    showOptions.value = !showOptions.value
  }

  const handleDocumentClick = (event: any) => {
    if (!showOptions.value) return

    const componentElement = event.target.closest('.select')
    const isOutsideClick = !componentElement

    if (isOutsideClick) {
      showOptions.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick)
  })

  const emits = defineEmits(['setSelectOption'])

  const setSelectOption = (option: OptionType) => {
    selectedOption.value = option.id
    emits('setSelectOption', selectedOption.value)
  }
</script>

<style scoped>
  .options-enter-active {
    transition: all 0.3s ease-out;
  }
  .options-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .options-enter-from,
  .options-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
</style>

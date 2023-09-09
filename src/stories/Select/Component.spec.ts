import { mount, VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Select from './Component.vue'

const selectOptions = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
  { id: '5', label: 'Option 5' },
  { id: '6', label: 'Option 6' },
  { id: '7', label: 'Option 7' },
  { id: '8', label: 'Option 8' },
  { id: '9', label: 'Option 9' },
  { id: '10', label: 'Option 10' }
]

const props = {
  id: 'select-id',
  label: 'Select Label',
  required: false,
  size: 'medium',
  error: false,
  feedback: '',
  options: selectOptions
}

const wrapper: VueWrapper<typeof Select> = mount(Select, {
  props
})

describe('Base Select Component', () => {
  describe('Render', () => {
    it('should render the component correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })
    it('should display the options correctly', async () => {
      const select = wrapper.find('.select')
      await select.trigger('click')
      const options = wrapper.findAll('.select__option')
      expect(options.length).toBe(selectOptions.length)
    })
    it('should render the required', async () => {
      await wrapper.setProps({ required: true })
      const required = wrapper.find('.required-label')
      expect(required.exists()).toBe(true)
    })
    it('should render the feedback', async () => {
      await wrapper.setProps({ error: true, feedback: 'Error message' })
      const error = wrapper.find('.feedback')
      expect(error.text()).toBe('Error message')
    })
    it('should hide options when clicking outside', async () => {
      await document.body.click()
      const options = wrapper.findAll('.select__option')
      expect(options.length).toBe(0)
    })
    it('should return false when showOptions is false', async () => {
      await document.body.click()
      expect(wrapper.vm.showOptions).toBe(false)
    })
  })
  describe('v-model prop', () => {
    it('should show the selectedOptionLabel computed', async () => {
      await wrapper.find('.select').trigger('click')
      const options = wrapper.findAll('.select__option')
      await options[0].trigger('click')
      expect(wrapper.vm.selectedOptionLabel).toBe(selectOptions[0].label)
    })
    it('should sync the v-model prop with the input element', async () => {
      const input = wrapper.find(`#${props.id}`)
      await input.setValue('Hello')
      expect((input.element as HTMLInputElement).value).toBe('Hello')
    })
  })
  describe('Events', () => {
    it('should remove event listener when unmounted', async () => {
      const wrapper = mount(Select)
      const spy = vi.spyOn(document, 'removeEventListener')
      wrapper.unmount()
      expect(spy).toHaveBeenCalledWith('click', expect.any(Function))
    })
  })
})

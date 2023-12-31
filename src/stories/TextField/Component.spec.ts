import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TextField from './Component.vue'
import PasswordToggle from './fragments/PasswordToggle'
import ClearInput from './fragments/ClearInput'

const props = {
  id: 'testing-input',
  label: 'Testing input',
  required: true,
  size: 'large' as const,
  error: false,
  feedback: '',
  type: 'text' as const,
  showEye: false,
  fieldValue: '',
  showClear: false
}

const wrapper = mount(TextField, {
  props
})

describe('TextFieldComponent', () => {
  describe('render types', () => {
    it('should render the password type', async () => {
      const wrapper = mount(TextField, {
        props: {
          ...props,
          type: 'password'
        }
      })
      expect(wrapper.find('input').attributes('type')).toBe('password')
    })

    it('should render the text type', async () => {
      await wrapper.setProps({ type: 'text' })
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })
  })
  describe('sizes', () => {
    it('should render the small size', async () => {
      await wrapper.setProps({ size: 'small' })
      expect(wrapper.find('.text-input').classes()).toContain('w-40')
    })

    it('should render the medium size', async () => {
      await wrapper.setProps({ size: 'medium' })
      expect(wrapper.find('.text-input').classes()).toContain('w-60')
    })

    it('should render the large size', async () => {
      await wrapper.setProps({ size: 'large' })
      expect(wrapper.find('.text-input').classes()).toContain('w-80')
    })

    it('should render the full size', async () => {
      await wrapper.setProps({ size: 'full' })
      expect(wrapper.find('.text-input').classes()).toContain('w-full')
    })
  })
  describe('static props', () => {
    it('should render the given id', () => {
      expect(wrapper.find('input').attributes('id')).toBe(props.id)
    })

    it('should render label', () => {
      expect(wrapper.find('label').text()).toContain(props.label)
    })
  })
  describe('error state', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        error: true,
        feedback: 'This is an error'
      })
    })

    afterEach(async () => {
      await wrapper.setProps({
        error: false,
        feedback: ''
      })
    })

    it('should render the error class', () => {
      expect(wrapper.find('.text-input').classes()).toContain('border-red-500')
    })

    it('should render the error feedback', () => {
      expect(wrapper.find('.feedback').text()).toContain('This is an error')
    })
  })
  describe('showEye', () => {
    it('should render the password toggle', async () => {
      await wrapper.setProps({
        showEye: true
      })
      expect(wrapper.findComponent(PasswordToggle).exists()).toBe(true)
    })

    it('should change the input type to text', async () => {
      const wrapper = mount(TextField, {
        props: {
          ...props,
          type: 'password',
          showEye: true
        }
      })
      const toggleButton = wrapper.findComponent(PasswordToggle)
      await toggleButton.trigger('click')
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('should change the input type to password', async () => {
      const wrapper = mount(TextField, {
        props: {
          ...props,
          type: 'text',
          showEye: true
        }
      })
      const toggleButton = wrapper.findComponent(PasswordToggle)
      await toggleButton.trigger('click')
      expect(wrapper.find('input').attributes('type')).toBe('password')
    })
  })
  describe('clear button', () => {
    it('should render the password toggle', async () => {
      await wrapper.setProps({
        showClear: true,
        showEye: false
      })
      await wrapper.find('input').setValue('testing')
      expect(wrapper.findComponent(ClearInput).exists()).toBe(true)
    })

    it('should clear the input', async () => {
      await wrapper.setProps({
        showClear: true,
        showEye: false
      })
      await wrapper.find('input').setValue('testing')
      const clearButton = wrapper.findComponent(ClearInput)
      await clearButton.trigger('click')
      expect(wrapper.find('input').element.value).toBe('')
    })
  })
})

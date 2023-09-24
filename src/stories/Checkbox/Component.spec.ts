import { mount, VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Checkbox from './Component.vue'

const props = {
  id: 'checkbox-id',
  label: 'Checkbox Label',
  required: false,
  size: 'medium',
  error: false,
  disabled: false
}

const wrapper: VueWrapper<typeof Checkbox> = mount(Checkbox, {
  props
})

describe('Base Checkbox Component', () => {
  describe('Render', () => {
    it('should render the component correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })
    it('should render the required', async () => {
      await wrapper.setProps({ required: true })
      const required = wrapper.find('.required-label')
      expect(required.exists()).toBe(true)
    })
    it('should render the disabled', async () => {
      await wrapper.setProps({ disabled: true })
      const checkbox = wrapper.find('input')
      expect(checkbox.attributes().disabled).toBe('')
    })
  })
  describe('Behavior', () => {
    it('should emit the value when clicking on the checkbox', async () => {
      const checkbox = wrapper.find('.checkbox')
      await wrapper.setProps({ disabled: false })
      await checkbox.trigger('click')
      expect(wrapper.emitted()).toHaveProperty('update:checked')
    })
  })
})

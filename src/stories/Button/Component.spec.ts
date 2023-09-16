import { mount } from '@vue/test-utils'
import { describe, it, vi, expect } from 'vitest'
import Button from './Component.vue'
import { RouterLinkStub } from '@vue/test-utils'

vi.mock('vue-router')

const props = {
  label: 'Click me!'
}

const wrapper = mount(Button, {
  props,
  global: {
    stubs: {
      RouterLink: RouterLinkStub
    }
  }
})

describe('ButtonComponent', () => {
  describe('render types', () => {
    it('should render the RouterLink type', async () => {
      await wrapper.setProps({ to: '/' })
      expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true)
    })

    it('should render a button type', async () => {
      await wrapper.setProps({
        to: undefined,
        type: 'button'
      })
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render a submit type', async () => {
      await wrapper.setProps({
        to: undefined,
        type: 'submit'
      })
      expect(wrapper.find('button').attributes('type')).toBe('submit')
    })

    it('should render a reset type', async () => {
      await wrapper.setProps({
        to: undefined,
        type: 'reset'
      })
      expect(wrapper.find('button').attributes('type')).toBe('reset')
    })
  })

  describe('props', () => {
    it('should render label', () => {
      expect(wrapper.text()).toBe(props.label)
    })

    it('should render the given type', async () => {
      const type = 'submit'
      await wrapper.setProps({ type })

      expect(wrapper.html()).toContain(`type="${type}"`)
    })

    it('should render the given theme', async () => {
      const theme = 'secondary'
      await wrapper.setProps({ theme })

      expect(wrapper.html()).toContain('bg-white')
    })

    it('should render the given size', async () => {
      const size = 'full'
      await wrapper.setProps({ size })

      expect(wrapper.html()).toContain('w-full')
    })

    it('should render the given disabled', async () => {
      const disabled = true
      await wrapper.setProps({ disabled })

      expect(wrapper.html()).toContain('bg-neutral-100')
    })
  })

  describe('events', () => {
    it('should emit click event', async () => {
      const onClick = vi.fn()
      const wrapper = mount(Button, {
        props: {
          label: 'Click me!',
          onClick
        }
      })
      await wrapper.find('button').trigger('click')
      expect(onClick).toHaveBeenCalled()
    })
  })
})

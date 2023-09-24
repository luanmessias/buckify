import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import tailwindConfig from '@TailwindConfig'
import SvgIcon from './Component.vue'
import IncomeIcon from '@Assets/svg/income.svg.vue'
import TriangleIcon from '@Assets/svg/triangle.svg.vue'

const props = {
  name: 'income',
  size: 'md',
  strokeWidth: '0',
  strokeColor: '',
  color: '',
  cssClass: ''
}

const wrapper: VueWrapper<typeof SvgIcon> = mount(SvgIcon, {
  props
})

beforeEach(async () => {
  await flushPromises()
  await vi.dynamicImportSettled()
})

describe('Base SvgIcon Component', () => {
  describe('Component Render', () => {
    it('should render the income icon', async () => {
      expect(wrapper.findComponent(IncomeIcon).exists()).toBe(true)
    })

    it('should render the triangle icon', async () => {
      const wrapper: VueWrapper<typeof SvgIcon> = mount(SvgIcon, {
        props: {
          ...props,
          name: 'triangle'
        }
      })
      await flushPromises()
      await vi.dynamicImportSettled()
      expect(wrapper.findComponent(TriangleIcon).exists()).toBe(true)
    })
  })

  describe('Component Props', () => {
    it('should render the sm size', async () => {
      const { sm } = tailwindConfig.theme.extend.icon.size
      await wrapper.setProps({ size: 'sm' })
      expect(wrapper.attributes('width')).toBe(sm)
    })

    it('should render the strokeWidth', async () => {
      await wrapper.setProps({ strokeWidth: '3' })
      expect(wrapper.attributes('stroke-width')).toBe('3')
    })

    it('should render the strokeColor', async () => {
      const strokeColor = 'text-danger-500'
      await wrapper.setProps({ strokeColor })
      expect(wrapper.classes()).toContain('stroke-current')
      expect(wrapper.classes()).toContain(strokeColor)
    })

    it('should render the color', async () => {
      const color = 'text-danger-500'
      await wrapper.setProps({ color })
      expect(wrapper.classes()).toContain('fill-current')
      expect(wrapper.classes()).toContain(color)
    })

    it('should render the cssClass', async () => {
      const cssClass = 'test-class'
      await wrapper.setProps({ cssClass })
      expect(wrapper.classes()).toContain(cssClass)
    })
  })
})

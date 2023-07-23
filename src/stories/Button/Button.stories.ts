import type { Meta, StoryObj } from '@storybook/vue3'

import Button from './Button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Navigation/Button',
  component: Button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    theme: {
      options: ['primary', 'secondary'],
      control: 'select'
    },
    size: {
      options: ['small', 'medium', 'large', 'full'],
      control: 'select'
    }
  },
  args: {
    type: 'button',
    theme: 'primary',
    size: 'medium',
    onClick: () => console.log('clicked')
  } // default value
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    label: 'Button'
  }
}

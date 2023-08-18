import type { Meta, StoryObj } from '@storybook/vue3'

import BaseButton from './'
import YtIcon from './img/icon.vue'

const meta = {
  title: 'Navigation/Button',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'The label of the button'
    },
    disabled: {
      description: 'Whether the button is disabled'
    },
    type: {
      control: 'select',
      description: 'The type of the button',
      options: ['button', 'submit', 'reset']
    },
    theme: {
      control: 'select',
      description: 'The theme of the button',
      options: ['primary', 'secondary', 'disabled']
    },
    size: {
      control: 'select',
      description: 'The size of the button',
      options: ['small', 'medium', 'large', 'full']
    },
    onClick: {
      action: 'clicked',
      description: 'Click of the button'
    },
    to: {
      description: 'The route to link to'
    }
  },
  args: {
    onClick: () => console.log('clicked'),
    label: 'Button'
  }
} satisfies Meta<typeof BaseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: {
    theme: 'secondary'
  }
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { YtIcon, BaseButton },
    setup() {
      return {
        args
      }
    },
    template: `
      <BaseButton v-bind="args">
        <YtIcon />
      </BaseButton>
    `
  }),
  args: {
    theme: 'secondary'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    theme: 'disabled'
  }
}

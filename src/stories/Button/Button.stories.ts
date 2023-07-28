import type { Meta, StoryObj } from '@storybook/vue3'

import Button from './'
import YtIcon from './img/icon.vue'

const meta = {
  title: 'Navigation/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      description: 'The theme of the button',
      options: ['primary', 'secondary', 'disabled'],
    },
    size: {
      control: 'select',
      description: 'The size of the button',
      options: ['small', 'medium', 'large', 'full'],
    },
    onClick: {
      action: 'clicked',
      description: 'Click of the button',
    },
    to: {
      description: 'The route to link to',
    },
  },
  args: {
    type: 'button',
    theme: 'primary',
    size: 'medium',
    onClick: () => console.log('clicked'),
    label: 'Button',
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { }

export const Secondary: Story = {
  args: {
    theme: 'secondary'
  }
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { YtIcon, Button },
    setup() {
      return {
        args,
      };
    },
    template: `
      <Button v-bind="args">
        <YtIcon />
      </Button>
    `,
  }),
  args: {
    theme: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    theme: 'disabled'
  },
};
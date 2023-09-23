import type { Meta, StoryObj } from '@storybook/vue3'

import SvgIcon from './'

const meta = {
  title: 'Data Display/SvgIcon',
  component: SvgIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      description: 'The name of the icon. Refer to the icon list for the available icon names.',
      control: 'text'
    },
    size: {
      description: 'The size of the icon.',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    color: {
      description: 'The color of the icon.',
      control: 'text'
    },
    strokeColor: {
      description: 'The stroke color of the icon.',
      control: 'text'
    },
    strokeWidth: {
      description: 'The stroke width of the icon.',
      control: 'number'
    },
    cssClass: {
      description: 'The class name of the icon.',
      control: 'text'
    }
  },
  args: {
    name: 'income'
  },
  parameters: {
    docs: {
      story: {
        inline: false
      }
    }
  }
} satisfies Meta<typeof SvgIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Size: Story = {
  args: {
    size: 'sm'
  }
}

export const Color: Story = {
  args: {
    Size: 'lg',
    color: 'text-danger-500'
  }
}

export const All: Story = {
  args: {
    size: 'xl',
    color: 'text-success-500'
  }
}

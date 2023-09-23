import type { Meta, StoryObj } from '@storybook/vue3'

import BaseCheckbox from './'

const meta = {
  title: 'Inputs/Checkbox',
  component: BaseCheckbox,
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'The id of the text field'
    },
    label: {
      control: 'text',
      description: 'The label of the text field'
    },
    size: {
      control: 'select',
      description: 'The size of the button',
      options: ['small', 'medium', 'large']
    },
    required: {
      control: 'boolean',
      description: 'If the field is required'
    },
    disabled: {
      control: 'boolean',
      description: 'If the field is disabled'
    },
    feedback: {
      control: 'text',
      description: 'The feedback of the text field'
    }
  },
  args: {
    id: 'base-checkbox',
    label: 'Checkbox'
  },
  parameters: {
    docs: {
      story: {
        inline: false
      }
    }
  }
} satisfies Meta<typeof BaseCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

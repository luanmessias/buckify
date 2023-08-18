import type { Meta, StoryObj } from '@storybook/vue3'

import BaseTextField from './'

const meta = {
  title: 'Inputs/Text Field',
  component: BaseTextField,
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
      options: ['small', 'medium', 'large', 'full']
    },
    required: {
      control: 'boolean',
      description: 'If the field is required'
    },
    feedback: {
      control: 'text',
      description: 'The feedback of the text field'
    },
    type: {
      control: 'select',
      description: 'The type of the text field',
      options: ['text', 'password', 'email', 'number', 'tel', 'url']
    }
  },
  args: {
    label: 'Text field',
    id: 'text-field'
  }
} satisfies Meta<typeof BaseTextField>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

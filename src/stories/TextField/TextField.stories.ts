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

export const Primary: Story = {
  args: {
    id: 'text-field-primary',
    label: 'Text field primary'
  }
}

export const Required: Story = {
  args: {
    id: 'text-field-required',
    label: 'Text field required',
    required: true
  }
}

export const password: Story = {
  args: {
    id: 'text-field-password',
    label: 'Text field password',
    type: 'password',
    showEye: true
  }
}

export const WithClear: Story = {
  args: {
    id: 'text-field-clear',
    label: 'Text field with clear',
    showClear: true,
    fieldValue: 'Text field with clear'
  }
}

export const Error: Story = {
  args: {
    id: 'text-field-error',
    label: 'Text field error',
    feedback: 'Error message',
    error: true,
    showClear: true
  }
}

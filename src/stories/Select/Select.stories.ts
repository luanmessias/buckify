import type { Meta, StoryObj } from '@storybook/vue3'

import BaseSelect from './'

const meta = {
  title: 'Inputs/Select',
  component: BaseSelect,
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
    options: {
      control: 'array',
      description: 'The options of the select field'
    }
  },
  args: {
    label: 'Text field',
    id: 'text-field',
    options: [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' },
      { id: '3', label: 'Option 3' },
      { id: '4', label: 'Option 4' },
      { id: '5', label: 'Option 5' },
      { id: '6', label: 'Option 6' },
      { id: '7', label: 'Option 7' },
      { id: '8', label: 'Option 8' },
      { id: '9', label: 'Option 9' },
      { id: '10', label: 'Option 10' }
    ]
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 280
      }
    }
  }
} satisfies Meta<typeof BaseSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    id: 'select-primary',
    label: 'Select primary'
  }
}

export const NoOptions: Story = {
  args: {
    id: 'select-no-options',
    label: 'Select no options',
    options: []
  }
}

export const Required: Story = {
  args: {
    id: 'select-required',
    label: 'Select required',
    required: true
  }
}

export const Error: Story = {
  args: {
    id: 'select-feedback-error',
    label: 'Select feedback error',
    feedback: 'Error message',
    required: true,
    error: true
  }
}

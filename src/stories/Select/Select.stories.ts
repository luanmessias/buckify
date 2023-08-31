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
      control: 'select',
      description: 'The options of the select field',
      options: ['option1', 'option2', 'option3']
    }
  },
  args: {
    label: 'Text field',
    id: 'text-field'
  }
} satisfies Meta<typeof BaseSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    id: 'text-field-primary',
    label: 'Text field primary',
    options: ['option1', 'option2', 'option3']
  }
}

import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { InputField } from './'

const meta = {
  title: 'Base/InputField',
  component: InputField,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() }
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    name: 'input-example',
    type: 'text',
    label: 'Label Example',
    placeholder: 'Placeholder Example'
  }
}

export const Password: Story = {
  args: {
    name: 'input-example-password',
    type: 'password',
    label: 'Password',
    placeholder: 'Placeholder Example',
    isPassword: true
  }
}

export const ErrorStatus: Story = {
  args: {
    name: 'input-example-error',
    type: 'password',
    label: 'Password',
    placeholder: 'Password',
    isPassword: true,
    error: true,
    feedback: [
      'Password is required',
      'Password must be at least 8 characters',
      'Password must contain at least one number'
    ]
  }
}

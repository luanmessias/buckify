import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Icon } from './'

const meta = {
  title: 'Base/Icon',
  component: Icon,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() }
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    name: 'activity',
    size: 24,
    color: 'black'
  }
}

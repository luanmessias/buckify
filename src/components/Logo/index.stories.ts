import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Logo } from './';

const meta = {
  title: 'Base/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};


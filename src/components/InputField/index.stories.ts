import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InputField } from './';

const meta = {
  title: 'Base/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'input-example',
    type: 'text',
    label: 'Label Example',
    placeholder: 'Placeholder Example',
  },
};

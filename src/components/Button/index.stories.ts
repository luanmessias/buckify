import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from './';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Base/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: { 
        control: 'select',
        options: ['primary', 'outline', 'icon', 'iconPrimary', 'iconOutline'],
    },
    as: {
      control: 'select',
      options: ['button', 'link'],
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ButtonPrimary: Story = {
  args: {
    variant: 'primary',
    label: 'Primary Button',
    as: 'button',
  },
};

export const ButtonOutline: Story = {
  args: {
    variant: 'outline',
    label: 'Outline Button',
    as: 'button',
  },
};

export const ButtonWithIcon: Story = {
  args: {
    variant: 'outline',
    label: 'Outline Button With Icon',
    as: 'button',
    icon: 'activity',
  },
};

export const ButtonWithBrand: Story = {
  args: {
    variant: 'outline',
    label: 'Outline Button With Icon',
    as: 'button',
    brand: 'google-g-logo',
  },
};

export const OnlyIcon: Story = {
  args: {
    variant: "icon",
    label: "",
    as: "button",
    icon: "activity",
    iconColor: "#ffffff"
  }
};

export const IconPrimary: Story = {
  args: {
    variant: "iconPrimary",
    label: "",
    as: "button",
    icon: "activity",
    iconColor: "#ffffff"
  }
};

export const iconOutline: Story = {
  args: {
    variant: "iconOutline",
    label: "",
    as: "button",
    icon: "activity",
    iconColor: "gray"
  }
};

export const BrandOnly: Story = {
  args: {
    variant: "icon",
    label: "",
    as: "button",
    brand: "google-g-logo"
  }
};

export const BrandPrimary: Story = {
  args: {
    variant: "iconPrimary",
    label: "",
    as: "button",
    brand: "google-g-logo"
  }
};

export const BrandOutline: Story = {
  args: {
    variant: "iconOutline",
    label: "",
    as: "button",
    brand: "google-g-logo"
  }
};

export const ButtonAsLink: Story = {
  args: {
    variant: "outline",
    label: "This Button Is a Link",
    as: "link",
    brand: "",
    icon: "link-2",
    href: "https://www.google.com/",
    targetBlank: true
  }
};
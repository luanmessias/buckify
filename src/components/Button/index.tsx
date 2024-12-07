import React from 'react';
import { tv } from 'tailwind-variants';

const button = tv({
  base: [
    ''
  ],
})

export interface ButtonProps {
  type: 'button' | 'link';
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
  icon: string;
  onClick?: () => void;
}

export const Button = ({
  type = 'button',
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  icon,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={button()}
      {...props}
    >
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};

import React, { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import Link from 'next/link';
import Image from "next/image";
import { Icon } from '../Icon';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const button = tv({
  base: 'flex items-center gap-4 w-full py-4 px-6 rounded text-base',
  variants: {
    variant: {
      primary: 'bg-teal-500 text-white',
      outline: 'border border-gray-300 bg-white text-gray-500',
      icon: 'py-4 px-4 text-zero',
    }
  }
})

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button> & {
  variant: 'primary' | 'outline' | 'icon';
  label?: string;
  icon?: keyof typeof dynamicIconImports;
  iconColor?: string;
  brand?: string;
  onClick: () => void;
  as?: 'button' | 'link';
  href?: string;
};

export const Button = ({
  type = 'button',
  variant = 'primary',
  label,
  as = 'button',
  href,
  icon,
  iconColor,
  ...props
}: ButtonProps) => {
  const Component: React.ElementType = as === 'link' ? Link : 'button';
  const iconColorStyle = iconColor ? iconColor : 'currentColor';
  return (
    <Component
      className={button({ variant })}
      {...(as === 'link' ? { href } : { type })}
      {...props}
    >
      {props.brand &&
        <Image
          aria-hidden
          src={`./brands/${props.brand}.svg`}
          alt="File icon"
          width={28}
          height={28}
          unoptimized
        />
      }

      {icon &&
        <Icon name={icon} size={24} color={iconColorStyle} />
      }

      {label}
    </Component>
  );
};

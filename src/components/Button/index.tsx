import React, { ComponentProps } from 'react'
import { tv, VariantProps } from 'tailwind-variants'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '../Icon'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { motion } from 'framer-motion'

const button = tv({
  base: 'flex items-center gap-4 w-full py-4 px-6 rounded text-base transition duration-default ease-in-out',
  variants: {
    variant: {
      primary: 'bg-teal-500 text-white hover:bg-teal-600',
      outline:
        'border border-gray-300 bg-white text-gray-500 hover:bg-gray-100',
      icon: 'py-4 px-4 text-zero',
      iconPrimary:
        'bg-teal-500 text-white py-4 px-4 text-zero hover:bg-teal-600',
      iconOutline:
        'border border-gray-300 bg-white text-gray-500 py-4 px-4 text-zero hover:bg-gray-100'
    }
  }
})

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof button> & {
    variant: 'primary' | 'outline' | 'icon' | 'iconPrimary' | 'iconOutline'
    label?: string
    icon?: keyof typeof dynamicIconImports
    iconColor?: string
    brand?: string
    onClick: () => void
    as?: 'button' | 'link'
    href?: string
    targetBlank?: boolean
  }

export const Button = ({
  variant = 'primary',
  label,
  as = 'button',
  href,
  icon,
  iconColor,
  ...props
}: ButtonProps) => {
  const Component: React.ElementType = as === 'link' ? Link : 'button'
  const iconColorStyle = iconColor ? iconColor : 'currentColor'
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Component
        className={button({ variant })}
        {...(as === 'link' ? { href } : { as })}
        {...(as === 'link'
          ? { target: props.targetBlank ? '_blank' : undefined }
          : {})}
        {...props}
      >
        {props.brand && (
          <Image
            aria-hidden
            src={`./brands/${props.brand}.svg`}
            alt="File icon"
            width={28}
            height={28}
            unoptimized
          />
        )}

        {icon && <Icon name={icon} size={24} color={iconColorStyle} />}

        {label}
      </Component>
    </motion.div>
  )
}

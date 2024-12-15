import React, { ComponentProps, memo, useCallback, useState } from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import { Icon } from '../Icon';
import { motion } from "framer-motion";

const fieldContainer = tv({
  base: 'w-full py-4 px-6 rounded text-base transition duration-default ease-in-out',
})

const inputLabel = tv({
  base: 'block text-md font-semibold text-slate-500 mb-2',
  variants: {
    error: {
      true: 'text-red-400',
    },
  }
});

const inputArea = tv({
  base: 'w-full flex items-center mt-2 border-2 border-gray-100 rounded-lg px-5 py-3 bg-gray-50',
  variants: {
    error: {
      true: 'border-red-400',
    },
  }
});

const input = tv({
  base: 'w-full h-full border-none text-md bg-none text-gray-500 bg-transparent focus:outline-none',
  variants: {
    error: {
      true: 'text-red-400 placeholder-red-400',
    },
  }
});

const inpuitIcon = tv({
  base: 'text-gray-500 cursor-pointer',
  variants: {
    hidden: {
      true: 'hidden',
    },
    error: {
      true: 'text-red-400',
    },
  }
});

const inputFeedback = tv({
  base: 'block text-xs font-light text-gray-500 mt-1',
  variants: {
    error: {
      true: 'text-red-400',
    },
  }
});

export type InputFieldProps = ComponentProps<'input'> & VariantProps<typeof input> & {
  name: string;
  type: 'text' | 'email' | 'password';
  label?: string;
  error?: boolean;
  placeholder?: string;
  feedback?: string;
  required?: boolean;
  disabled?: boolean;
}

const MemoizedIcon = memo(Icon);

export const InputField = ({ ...props }: InputFieldProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClearInput = useCallback(() => setInputValue(''), []);
  const handleSetInputType = useCallback((value: string) => setInputValue(value), []);

  const handleTogglePassword = useCallback(() => setShowPassword(!showPassword), [showPassword]);

  return (
    <div className={fieldContainer()}>
      <label
        className={inputLabel({ error:  props.error })}
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <div className={inputArea({ error:  props.error })}>
        <input 
          className={input({ error:  props.error })} {...props} value={inputValue}
          onChange={(e) => handleSetInputType(e.target.value)}
        />
          <div className='w-6 h-6'>
            {props.type === 'text' && inputValue &&
              <MemoizedIcon
                className={inpuitIcon({ hidden: !inputValue, error: props.error })}
                name='x' 
                size={24}
                onClick={handleClearInput}
              />
            }

            {props.type === 'password' && inputValue &&
              <MemoizedIcon
                className={inpuitIcon({ hidden: !inputValue })}
                name={showPassword ? 'eye-closed' : 'eye'}
                size={24}
                onClick={handleTogglePassword}
              />
            }
          </div>
      </div>
      {props.feedback && 
        <span className={inputFeedback({ error:  props.error })}>{props.feedback}</span>
      }
    </div>
  );
}
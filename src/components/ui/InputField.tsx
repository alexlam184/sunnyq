import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputProps {
  name?: string | '';
  register?: UseFormRegister<any> | undefined;
  registerName?: string | '';
  type: string;
  title: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  defaultValue?: string | number | '';
}

const InputField: React.FC<InputProps> = ({
  name,
  register,
  registerName,
  type,
  title,
  onChange,
  onBlur,
  defaultValue,
}) => {
  return (
    <label className='bg-white relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600'>
      <input
        {...(register ? register(registerName || '') : {})}
        name={name}
        type={type}
        id={title}
        placeholder={title}
        className='peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-black'
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
      />

      <span className='absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs'>
        {title}
      </span>
    </label>
  );
};

export default InputField;

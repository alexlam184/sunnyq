import React, { ChangeEventHandler } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface TextAreaProps {
  name?: string | '';
  register?: UseFormRegister<any> | undefined;
  registerName?: string | '';
  title: string;
  rows: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement> | undefined;
  defaultValue?: string | '';
  disabled?: boolean | false;
}

const TextAreaField: React.FC<TextAreaProps> = ({
  name,
  register,
  registerName,
  title,
  rows,
  onChange,
  onBlur,
  defaultValue,
  disabled,
}) => {
  return (
    <label className=' bg-white relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600'>
      <textarea
        {...(register ? register(registerName || '') : {})}
        name={name}
        id={title}
        placeholder={title}
        rows={rows}
        className='peer w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-black pt-6'
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
        disabled={disabled}
      ></textarea>
      <span className='absolute left-3 top-2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/8 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs'>
        {title}
      </span>
    </label>
  );
};

export default TextAreaField;

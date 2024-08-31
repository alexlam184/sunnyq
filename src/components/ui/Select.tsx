import React from 'react';
import { UseFormRegister } from 'react-hook-form';

export interface SelectOption {
  label: string;
  value: any;
}

interface SelectProps {
  name?: string | '';
  register?: UseFormRegister<any> | undefined;
  registerName?: string | '';
  options: SelectOption[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement> | undefined;
  onBlur?: React.FocusEventHandler<HTMLSelectElement> | undefined;
  defaultValue?: any;
}

export const Select: React.FC<SelectProps> = ({
  name,
  register,
  registerName,
  options,
  onChange,
  onBlur,
  defaultValue,
}) => {
  return (
    <select
      {...(register ? register(registerName || '') : {})}
      name={name}
      id={name}
      className='mt-1.5 w-auto rounded-md border-gray-300 text-gray-700 sm:text-sm p-3 bg-slate-50'
      onChange={onChange}
      onBlur={onBlur}
      defaultValue={defaultValue}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

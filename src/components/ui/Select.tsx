import { CHOICE } from '@/src/lib/type';
import React from 'react';

export interface Option {
  label: string;
  value: any;
}

interface SelectProps {
  name: string;
  options: Option[];
  onChange: (choice: Option) => void;
  value?: any;
}

export const Select: React.FC<SelectProps> = ({
  name,
  options,
  onChange,
  value,
}) => {
  return (
    <div>
      <select
        name={name}
        id={name}
        className='mt-1.5 w-full rounded-md border-gray-300 text-gray-700 sm:text-sm p-3 bg-slate-50'
        onChange={(e) => {
          onChange(options[parseInt(e.target.value)]);
        }}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

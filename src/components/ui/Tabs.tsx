import React, { useState } from 'react';

export interface TabOption {
  label: string;
  value: any;
}

interface TabProps {
  options: TabOption[];
  onChange: (selectedOption: TabOption) => void;
  defaultValue?: any;
  disabledValues?: any[];
}

const TabComponent: React.FC<TabProps> = ({
  options,
  onChange,
  defaultValue,
  disabledValues,
}) => {
  const [selectedOption, setSelectedOption] = useState<TabOption | null>(
    options.find((option) => option.value === defaultValue) || null
  );

  return (
    <div className='flex relative overflow-x-auto overflow-y-hidden border-gray-200 whitespace-nowrap dark:border-gray-700 justify-evenly'>
      <div
        className={`absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-in-out`}
      />
      {options.map((option: TabOption, index) => {
        const disabled: boolean =
          disabledValues?.includes(option.value) || false;
        return (
          <button
            key={index}
            onClick={() => {
              setSelectedOption(option);
              onChange(option);
            }}
            className={`inline-flex items-center h-10 px-4 text-lg text-center ${
              disabled
                ? 'text-gray-300'
                : option.value === selectedOption?.value
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-700'
            } sm:text-base dark:text-blue-300 whitespace-nowrap focus:outline-none`}
            disabled={disabled}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabComponent;

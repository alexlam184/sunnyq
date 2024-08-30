import React, { useEffect, useState } from 'react';

export interface TabOption {
  label: string;
  value: any;
}

const TabComponent = ({
  name,
  options,
  onChange,
  defaultValue,
  disabledValues,
  themeColor = 'blue',
}: {
  name?: string | '';
  options: TabOption[];
  onChange?: ((selectedOption: TabOption) => void) | undefined;
  defaultValue?: any;
  disabledValues?: any[];
  themeColor?: 'blue' | 'green' | 'red';
}) => {
  const [selectedOption, setSelectedOption] = useState<TabOption | undefined>(
    options.find((option) => option.value === defaultValue) || undefined
  );

  useEffect(() => {
    if (
      selectedOption &&
      (!options.some((option) => option.value === selectedOption.value) ||
        disabledValues?.includes(selectedOption.value))
    ) {
      // Find the next available option that is not disabled
      const nextOption = options.find(
        (option) => !disabledValues?.includes(option.value)
      );

      if (nextOption) {
        setSelectedOption(nextOption);
        onChange && onChange(nextOption);
      }
    }
  }, [selectedOption, disabledValues, options, onChange]);

  const bgColorVariant = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  const selectedColorVariant = {
    blue: 'text-blue-600 border-blue-500 border-b-2',
    green: 'text-green-600 border-green-500 border-b-2',
    red: 'text-red-600 border-red-500 border-b-2',
  };

  return (
    <div className='flex relative overflow-x-auto overflow-y-hidden border-gray-200 whitespace-nowrap dark:border-gray-700 justify-evenly'>
      <div
        className={`absolute bottom-0 h-0.5 ${bgColorVariant[themeColor]} transition-all duration-300 ease-in-out`}
      />
      {options.map((option: TabOption, index) => {
        const disabled: boolean =
          disabledValues?.includes(option.value) || false;
        return (
          <button
            name={name}
            type='button'
            key={index}
            onClick={(e) => {
              if (!disabled) {
                setSelectedOption(option);
                onChange && onChange(option);
              }
            }}
            className={`inline-flex items-center h-10 px-4 text-lg text-center ${
              disabled
                ? 'text-gray-300'
                : option.value === selectedOption?.value
                  ? selectedColorVariant[themeColor]
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

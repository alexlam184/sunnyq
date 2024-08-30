import React, { useState } from 'react';

interface ToggleProps {
  onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  disabled?: boolean;
  activeColor?: 'blue' | 'green' | 'red' | 'gray';
  inactiveColor?: 'gray' | 'blue' | 'green' | 'red';
  defaultChecked?: false | boolean;
}
const Toggle: React.FC<ToggleProps> = ({
  onClick,
  disabled,
  activeColor = 'green',
  inactiveColor = 'gray',
  defaultChecked,
}) => {
  const activeColorVariant = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
  };
  const inactiveColorVariant = {
    blue: 'bg-blue-300',
    green: 'bg-green-300',
    red: 'bg-red-300',
    gray: 'bg-gray-300',
  };
  const [checked, setChecked] = useState<boolean>(defaultChecked || false);
  return (
    <label
      className={`relative inline-block h-8 w-14 cursor-pointer rounded-full transition [-webkit-tap-highlight-color:_transparent] ${checked ? activeColorVariant[activeColor] : inactiveColorVariant[inactiveColor]}`}
    >
      <input
        type='checkbox'
        className='peer sr-only'
        defaultChecked={defaultChecked}
        onClick={(e) => {
          onClick && onClick(e);
          setChecked(!checked);
        }}
        disabled={disabled}
      />
      <span className='absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6'></span>
    </label>
  );
};

export default Toggle;

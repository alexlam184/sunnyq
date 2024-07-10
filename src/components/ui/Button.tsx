import React from 'react';

interface ButtonProps {
  buttonText: string;
  onClick: () => void;
  buttonType: 'base' | 'border';
  themeColor: 'blue' | 'green' | 'red';
}

const Button: React.FC<ButtonProps> = ({
  buttonText,
  onClick,
  buttonType,
  themeColor,
}) => {
  const baseBackColorVariant = {
    blue: 'border-blue-600 group-active:border-blue-500',
    green: 'border-green-600 group-active:border-green-500',
    red: 'border-red-600 group-active:border-red-500',
  };

  const baseFrontColorVariant = {
    blue: 'border-blue-600 bg-blue-600 active:border-blue-500 active:bg-blue-500',
    green:
      'border-green-600 bg-green-600 active:border-green-500 active:bg-green-500',
    red: 'border-red-600 bg-red-600 active:border-red-500 active:bg-red-500',
  };

  const borderColorVariant = {
    blue: 'text-blue-600 active:text-blue-500',
    green: 'text-green-600 active:text-green-500',
    red: 'text-red-600 active:text-red-500',
  };
  return buttonType === 'base' ? (
    <a
      className={`text-white dark:text-black group relative inline-block text-sm font-medium text-blue focus:outline-none focus:ring`}
      onClick={onClick}
    >
      <span
        className={`absolute inset-0 border ${baseBackColorVariant[themeColor]}`}
      ></span>
      <span
        className={`${baseFrontColorVariant[themeColor]} block border px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
      >
        {buttonText}
      </span>
    </a>
  ) : (
    <a
      className={`${borderColorVariant[themeColor]} group relative inline-block text-sm font-medium focus:outline-none focus:ring`}
      onClick={onClick}
    >
      <span className={`absolute inset-0 border border-current`}></span>
      <span
        className={`block border border-current bg-blue px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
      >
        {buttonText}
      </span>
    </a>
  );
};

export default Button;

import React from 'react';

interface ButtonProps {
  buttonText: string;
  onClick: () => void;
  buttonType: 'base' | 'border';
}

const Button: React.FC<ButtonProps> = ({ buttonText, onClick, buttonType }) => {
  return buttonType === 'base' ? (
    <a
      className={`group relative inline-block text-sm font-medium text-blue focus:outline-none focus:ring`}
      onClick={onClick}
    >
      <span
        className={`absolute inset-0 border border-blue-600 group-active:border-blue-500`}
      ></span>
      <span
        className={`block border border-blue-600 bg-blue-600 px-12 py-3 transition-transform active:border-blue-500 active:bg-blue-500 group-hover:-translate-x-1 group-hover:-translate-y-1`}
      >
        {buttonText}
      </span>
    </a>
  ) : (
    <a
      className={`group relative inline-block text-sm font-medium text-blue-600 focus:outline-none focus:ring active:text-blue-500 `}
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

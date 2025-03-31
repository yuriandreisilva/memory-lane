import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

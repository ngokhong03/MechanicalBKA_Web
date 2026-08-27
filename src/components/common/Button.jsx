import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled = false, 
  className = '',
  icon: Icon
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
    >
      {Icon && <Icon className="btn-icon" size={18} />}
      {children}
    </button>
  );
};

export default Button;

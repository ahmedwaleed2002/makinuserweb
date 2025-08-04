import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-makin-orange hover:bg-makin-deep-orange text-white focus:ring-makin-orange/50 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-makin-black focus:ring-gray-500/50',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-makin-black focus:ring-gray-500/50',
    ghost: 'text-makin-gray hover:text-makin-black hover:bg-gray-100 focus:ring-gray-500/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50 shadow-sm hover:shadow-md'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className={`${iconSizeClasses[size]} animate-spin mr-2`} />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className={`${iconSizeClasses[size]} mr-2`}>
          {icon}
        </span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className={`${iconSizeClasses[size]} ml-2`}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;

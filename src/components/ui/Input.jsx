import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const hasError = !!error;
  
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg text-makin-black placeholder-gray-400 
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
    ${hasError 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-gray-300 focus:border-makin-orange focus:ring-makin-orange/20 hover:border-gray-400'
    }
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-makin-black">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`w-5 h-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`}>
              {icon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={`w-5 h-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`}>
              {icon}
            </span>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <span>{error}</span>
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

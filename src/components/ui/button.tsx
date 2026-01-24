import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'accent';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

        const variants = {
            primary: 'bg-primary text-primary-foreground hover:bg-orange-600 focus:ring-orange-500 shadow-lg shadow-orange-900/20',
            outline: 'border border-gray-700 bg-transparent hover:bg-white/5 text-foreground focus:ring-gray-500',
            ghost: 'hover:bg-white/10 text-foreground',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-900/20',
            accent: 'bg-accent text-white hover:bg-blue-600 focus:ring-blue-500 shadow-lg shadow-blue-900/20',
        };

        const sizes = {
            sm: 'h-9 px-3 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

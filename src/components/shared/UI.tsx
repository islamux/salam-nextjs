'use client';

// Reusable UI components following DRY principle
// Eliminates duplication of common styling and patterns

// =============================================================================
// CARD COMPONENT
// =============================================================================

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-lg
        border border-gray-200 dark:border-gray-700
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ariaLabel,
  title,
  type = 'button',
}: ButtonProps) {
  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={`
        rounded-md
        font-medium
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// =============================================================================
// FLEX CONTAINER COMPONENT
// =============================================================================

export interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Flex({
  children,
  direction = 'row',
  align = 'center',
  justify = 'start',
  gap = 'md',
  className = '',
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const gapClasses = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={`
        flex
        ${directionClasses[direction]}
        ${alignClasses[align]}
        ${justifyClasses[justify]}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Convenience components
export const FlexRow = (props: Omit<FlexProps, 'direction'>) => (
  <Flex direction="row" {...props} />
);

export const FlexCol = (props: Omit<FlexProps, 'direction'>) => (
  <Flex direction="col" {...props} />
);

// =============================================================================
// TEXT COMPONENTS
// =============================================================================

export interface TextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Text({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: TextProps) {
  const variantClasses = {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <span className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}

// =============================================================================
// BADGE COMPONENT
// =============================================================================

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        rounded-full
        text-xs
        font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// =============================================================================
// CONTAINER COMPONENT
// =============================================================================

export interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Container({
  children,
  size = 'lg',
  className = '',
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className={`container mx-auto px-4 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

const variants = {
  primary: 'bg-brand-500 text-ink-900 hover:bg-brand-600 focus-visible:ring-brand-200',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-200',
  outline: 'bg-white text-ink-700 border border-ink-100 hover:bg-ink-50 focus-visible:ring-ink-100',
  ghost: 'bg-transparent text-ink-500 hover:bg-ink-100 focus-visible:ring-ink-100',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-50',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-colors duration-150 outline-none focus-visible:ring-4
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={17} strokeWidth={2.2} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={17} strokeWidth={2.2} />}
    </button>
  )
}

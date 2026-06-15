import { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export function Input({ label, required, error, className = '', ...props }: InputProps) {
  const input = (
    <input
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${className}`}
      {...props}
    />
  );

  if (!label) return input;

  return (
    <FormField label={label} required={required} error={error}>
      {input}
    </FormField>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, required, error, options, className = '', ...props }: SelectProps) {
  const select = (
    <select
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  if (!label) return select;

  return (
    <FormField label={label} required={required} error={error}>
      {select}
    </FormField>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export function Textarea({ label, required, error, className = '', ...props }: TextareaProps) {
  const textarea = (
    <textarea
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none ${className}`}
      rows={4}
      {...props}
    />
  );

  if (!label) return textarea;

  return (
    <FormField label={label} required={required} error={error}>
      {textarea}
    </FormField>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface CheckboxGroupProps {
  label: string;
  options: { value: string; label: string; checked?: boolean }[];
  onChange: (value: string, checked: boolean) => void;
  required?: boolean;
}

export function CheckboxGroup({ label, options, onChange, required }: CheckboxGroupProps) {
  return (
    <FormField label={label} required={required}>
      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="checkbox"
              checked={opt.checked}
              onChange={(e) => onChange(opt.value, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </FormField>
  );
}

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
}

export function NumberInput({ label, required, error, min, max, className = '', ...props }: NumberInputProps) {
  return (
    <Input
      label={label}
      required={required}
      error={error}
      type="number"
      min={min}
      max={max}
      className={className}
      {...props}
    />
  );
}

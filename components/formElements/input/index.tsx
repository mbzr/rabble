import React from 'react'

interface InputProps {
  id?: string
  name?: string
  type?: string
  label?: string
  children?: React.ReactNode
  defaultValue?: string
  value?: any
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void
  autoFocus?: boolean
  disabled?: boolean
  required?: boolean
  error?: string
  autoComplete?: string
  helpText?: string
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type,
  label,
  value,
  defaultValue,
  placeholder,
  onChange,
  onBlur,
  autoComplete,
  required,
  disabled,
  error,
  helpText,
  ...rest
}) => {
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        {label ? label : 'No label'}
      </label>
      <div className="mt-1">
        <input
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          aria-describedby="email-description"
          id={id}
          name={name}
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={(e) => {
            if (onChange) onChange(e)
          }}
          onBlur={(e) => {
            if (onBlur) onBlur(e)
          }}
          autoComplete={autoComplete}
          required={required}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {helpText && (
        <p className="mt-2 text-sm text-gray-500">
          We'll only use this for spam.
        </p>
      )}
    </div>
  )
}

export default Input

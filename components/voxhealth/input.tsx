import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  voiceEnabled?: boolean;
  onVoiceTap?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      voiceEnabled = true,
      onVoiceTap,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-base font-medium text-ink mb-3"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-4 md:py-3 rounded-[12px]
              border-2 border-rule
              bg-input text-foreground text-lg md:text-base
              placeholder:text-ink-muted
              transition-all
              focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 focus:ring-offset-4
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-coral focus:border-coral focus:ring-coral/20' : ''}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {/* Voice input affordance - micro mic icon to right */}
          {voiceEnabled && onVoiceTap && (
            <button
              type="button"
              onClick={onVoiceTap}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-ink-muted hover:text-sage transition-colors"
              aria-label="Voice input"
              title="Speak instead of typing"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17.3 11.61c-.63-.59-1.55-.89-2.3-.89-.75 0-1.67.3-2.3.89.35.35.58.82.58 1.34 0 1.07-.93 1.94-2.08 1.94s-2.08-.87-2.08-1.94c0-.52.23-.99.58-1.34-.63-.59-1.55-.89-2.3-.89-.75 0-1.67.3-2.3.89C4.97 12.5 4.25 13.9 4.25 15.5 4.25 18.21 6.59 20.25 9.5 20.25s5.25-2.04 5.25-4.75c0-1.6-.72-3-1.7-4.14z" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-coral text-sm font-medium mt-2">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-ink-subtle text-sm mt-2">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

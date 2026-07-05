import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  className,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className={clsx('relative w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-text-secondary select-none">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'w-full flex items-center justify-between bg-bg-secondary text-text-primary border rounded-lg px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer',
            error ? 'border-danger focus:ring-danger' : 'border-border focus:border-primary-500'
          )}
        >
          <span className={clsx(!selectedOption && 'text-text-muted')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={clsx('w-4 h-4 text-text-muted transition-transform duration-150', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute z-40 w-full mt-1.5 bg-bg-secondary border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full text-left px-3 py-2.5 text-sm hover:bg-bg-tertiary transition cursor-pointer',
                  opt.value === value ? 'text-primary-400 font-medium' : 'text-text-primary'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger font-medium animate-fade-in">{error}</p>}
    </div>
  );
};

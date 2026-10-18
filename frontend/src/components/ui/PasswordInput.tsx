import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter passcode',
  id = 'passcode-input',
  className = '',
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3.5 py-2 pr-10 text-sm font-mono rounded-lg bg-[#0D1630] border border-[#425B9A]/40 text-[#EAF1F8] placeholder-[#9FB0C9]/60 focus:border-[#76C0EC] focus:outline-none transition-colors"
      />
      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        disabled={disabled}
        className="absolute right-2.5 p-1 text-[#9FB0C9] hover:text-[#76C0EC] transition-colors focus-visible:ring-1 focus-visible:ring-[#76C0EC] rounded"
        aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
        aria-pressed={showPassword}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

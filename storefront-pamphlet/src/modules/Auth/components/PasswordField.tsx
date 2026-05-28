"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

const PasswordField = ({
  id,
  label,
  placeholder,
  registration,
  error,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-neutral-700">
        {label}
      </span>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 pr-12 text-sm text-neutral-800 outline-none transition-all focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
          {...registration}
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-500 transition-colors hover:text-brand-blue"
          onClick={() => setShowPassword((current) => !current)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error ? (
        <span className="mt-2 block text-xs font-medium text-red-600">
          {error.message}
        </span>
      ) : null}
    </label>
  );
};

export default PasswordField;

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  registration,
  error,
}: FormFieldProps) => {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-neutral-700">
        {label}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition-all focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
        {...registration}
      />
      {error ? (
        <span className="mt-2 block text-xs font-medium text-red-600">
          {error.message}
        </span>
      ) : null}
    </label>
  );
};

export default FormField;

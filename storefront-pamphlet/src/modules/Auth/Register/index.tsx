"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import AuthShell from "@/modules/Auth/components/AuthShell";
import FormField from "@/modules/Auth/components/FormField";
import PasswordField from "@/modules/Auth/components/PasswordField";
import { useAuth } from "@/context/AuthContext";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
};

const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { label: "Weak", width: "w-1/4", color: "bg-red-500" };
  }

  if (score <= 3) {
    return { label: "Medium", width: "w-2/3", color: "bg-amber-500" };
  }

  return { label: "Strong", width: "w-full", color: "bg-green-600" };
};

const Register = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" });
  const strength = getPasswordStrength(passwordValue || "");

  const onSubmit = async (values: RegisterValues) => {
    setSubmitError("");

    try {
      await registerUser(values);
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your account.";
      setSubmitError(message);

      setTimeout(() => {
        setSubmitError("");
      }, 5000);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join the platform and access trusted resources in minutes."
      altCtaText="Already have an account?"
      altCtaLabel="Sign in"
      altCtaHref="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="register-name"
          label="Name"
          placeholder="Your full name"
          registration={register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          error={errors.name}
        />

        <FormField
          id="register-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          error={errors.email}
        />

        <div>
          <PasswordField
            id="register-password"
            label="Password"
            placeholder="Create a secure password"
            registration={register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Use at least 8 characters",
              },
            })}
            error={errors.password}
          />

          <div className="mt-2">
            <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.width} ${strength.color}`}
              />
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Password strength:{" "}
              <span className="font-semibold">{strength.label}</span>
            </p>
          </div>
        </div>

        {submitError ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lift transition-all hover:bg-brand-blueDark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Register;

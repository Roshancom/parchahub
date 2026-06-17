"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AuthShell from "@/modules/Auth/components/AuthShell";
import FormField from "@/modules/Auth/components/FormField";
import PasswordField from "@/modules/Auth/components/PasswordField";
import { useAuth } from "@/context/AuthContext";

type LoginValues = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitError("");

    try {
      await login(values);
      router.push("/admin/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while logging in.";
      setSubmitError(message);

      setTimeout(() => {
        setSubmitError("");
      }, 5000);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Log in to manage your saved pamphlets and uploads."
      altCtaText="New to Pamphlet?"
      altCtaLabel="Create an account"
      altCtaHref="/admin/register"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="login-email"
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

        <PasswordField
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password}
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-brand-blue transition-colors hover:text-brand-blueDark"
          >
            Forgot Password?
          </Link>
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
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;

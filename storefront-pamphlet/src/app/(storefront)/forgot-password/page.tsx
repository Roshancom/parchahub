"use client";

import React, { Suspense } from "react";

import { useState } from "react";
import AuthShell from "@/modules/Auth/components/AuthShell";
import API, { requestPasswordReset } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const formRef = React.useRef<HTMLFormElement>(null);

  const searchParams = useSearchParams();

  const router = useRouter();

  const token = searchParams.get("token");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(trimmedEmail);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to send reset link. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgetPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formValue = new FormData(formRef.current ?? undefined);
    const password = formValue.get("password");
    const confirmPassword = formValue.get("confirmPassword");

    console.log({ password, confirmPassword });

    if (!password?.toString().trim() || !confirmPassword?.toString().trim()) {
      setPasswordError("Both password fields are required");
      return;
    }

    const payload = {
      token,
      password,
      confirmPassword,
    };

    API.post("/reset-password/confirm", payload)
      .then(() => router.push("/admin/login"))
      .catch((err) => {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to reset password. Please try again.";
        setPasswordError(message);
      });
  };

  if (token) {
    return (
      <AuthShell title="Forgot Password" subtitle="Enter your New Password ">
        <form
          ref={formRef}
          className="space-y-4"
          onSubmit={handleForgetPasswordSubmit}
          noValidate
        >
          <label className="block">
            <span className="text-sm font-semibold text-neutral-700">
              Password
            </span>
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm outline-none transition focus:border-brand-blue"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-neutral-700">
              Conform Password
            </span>
            <input
              type="password"
              placeholder="ConfirmPassword"
              name="confirmPassword"
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm outline-none transition focus:border-brand-blue"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-brand-blue px-5  mt-5 py-3 text-sm font-semibold text-white shadow-lift transition-all hover:bg-brand-blueDark disabled:cursor-not-allowed disabled:opacity-70"
            >
              Submit
            </button>{" "}
          </label>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email and we will send you a reset link."
      altCtaText="Remember your password?"
      altCtaLabel="Sign in"
      altCtaHref="/admin/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <label className="block">
          <span className="text-sm font-semibold text-neutral-700">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm outline-none transition focus:border-brand-blue"
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lift transition-all hover:bg-brand-blueDark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      {success ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          We have sent a reset link to your email. Please verify it to continue.
        </div>
      ) : null}
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full" /></div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

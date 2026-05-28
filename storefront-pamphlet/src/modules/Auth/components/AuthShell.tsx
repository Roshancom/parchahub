import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  altCtaText?: string;
  altCtaLabel?: string;
  altCtaHref?: string;
  children: React.ReactNode;
};

const AuthShell = ({
  title,
  subtitle,
  altCtaText,
  altCtaLabel,
  altCtaHref,
  children,
}: AuthShellProps) => {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto grid place-items-center">
        <div className="surface-card p-6 md:p-10 w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900">
            {title}
          </h2>

          <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>

          <div className="mt-6">{children}</div>

          <p className="mt-6 text-sm text-neutral-600">
            {altCtaText}{" "}
            {altCtaHref && (
              <Link
                href={altCtaHref}
                className="font-semibold text-brand-blue hover:underline"
              >
                {altCtaLabel}
              </Link>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthShell;

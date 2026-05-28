import Link from "next/link";

const HelpCenterPage = () => {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <p className="text-sm text-gray-500">Support</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-footer mt-2">
          Help Center
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl">
          Find quick answers about creating, sharing, and managing your
          pamphlets. If you need personal support, our team is ready to help.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Getting started
            </h2>
            <p className="mt-3 text-gray-600">
              Create an account, pick a template, and publish your first
              pamphlet in minutes.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Managing pamphlets
            </h2>
            <p className="mt-3 text-gray-600">
              Edit content, update images, and track engagement from your
              profile dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Account and security
            </h2>
            <p className="mt-3 text-gray-600">
              Reset passwords, update your email address, and manage sessions
              from the account settings page.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Still need help?
            </h2>
            <p className="mt-3 text-gray-600">
              Reach out to the support team and we will get back to you within
              one business day.
            </p>
            <Link
              href="/contact-us"
              className="mt-4 inline-flex items-center text-sm font-semibold text-brand-footer hover:underline"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpCenterPage;

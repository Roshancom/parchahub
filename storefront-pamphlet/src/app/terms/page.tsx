const TermsPage = () => {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <p className="text-sm text-gray-500">Legal</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-footer mt-2">
          Terms
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl">
          By using Pamphlets, you agree to the terms below. Please read them
          carefully.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Account responsibilities
            </h2>
            <p className="mt-3 text-gray-600">
              You are responsible for keeping your login credentials secure and
              for all activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Acceptable use
            </h2>
            <p className="mt-3 text-gray-600">
              Do not upload unlawful content, impersonate others, or attempt to
              disrupt the platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Content ownership
            </h2>
            <p className="mt-3 text-gray-600">
              You own your pamphlet content. You grant Pamphlets a license to
              host and display it as needed to operate the service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Limitation of liability
            </h2>
            <p className="mt-3 text-gray-600">
              The service is provided as is without warranties. We are not
              liable for damages arising from the use of the platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Termination
            </h2>
            <p className="mt-3 text-gray-600">
              We may suspend accounts that violate these terms. You can close
              your account at any time by contacting support.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default TermsPage;

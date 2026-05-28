const PrivacyPolicyPage = () => {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <p className="text-sm text-gray-500">Legal</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-footer mt-2">
          Privacy Policy
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl">
          This policy explains what information we collect, why we collect it,
          and how you can manage your data.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Information we collect
            </h2>
            <p className="mt-3 text-gray-600">
              We collect account details, pamphlet content you upload, and basic
              usage analytics that help us improve the product.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              How we use your data
            </h2>
            <p className="mt-3 text-gray-600">
              We use your data to provide the service, personalize your
              experience, and communicate important updates.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Sharing and retention
            </h2>
            <p className="mt-3 text-gray-600">
              We do not sell your data. We only share with trusted providers
              that help us operate the platform and retain data as long as your
              account is active.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Your choices
            </h2>
            <p className="mt-3 text-gray-600">
              You can request data exports, updates, or deletion by contacting
              support.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-brand-footer">
              Updates
            </h2>
            <p className="mt-3 text-gray-600">
              We may update this policy and will post changes on this page.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;

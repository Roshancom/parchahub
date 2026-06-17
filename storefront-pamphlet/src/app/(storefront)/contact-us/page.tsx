const ContactUsPage = () => {
  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-4 py-14">
        <p className="text-sm text-gray-500">Support</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-footer mt-2">
          Contact Us
        </h1>
        <p className="mt-4 text-gray-600">
          We would love to hear from you. Send us a note and we will respond
          soon.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-brand-footer">
              Email
            </h2>
            <p className="mt-3 text-gray-600">support@pamphlets.com</p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-brand-footer">
              Business hours
            </h2>
            <p className="mt-3 text-gray-600">
              Monday to Friday, 9:00 to 18:00
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm md:col-span-2">
            <h2 className="font-heading text-lg font-semibold text-brand-footer">
              What to include
            </h2>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li>Account email or business name</li>
              <li>A short description of the issue</li>
              <li>Any screenshots or links that help</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;

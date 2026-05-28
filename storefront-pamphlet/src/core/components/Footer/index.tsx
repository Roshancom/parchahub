import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-brand-footer text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-heading text-lg font-bold mb-4">About</h3>
          <p className="text-smtext-gray-500 leading-6">
            The Pamphlet Marketing Project is a web application that helps users
            create and manage digital pamphlets for sharing information or
            promoting products/services.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold mb-4">Categories</h3>
          <ul className="space-y-2 text-smtext-gray-500">
            <li>
              <Link
                href="/categories?category=business"
                className="hover:text-white"
              >
                Business
              </Link>
            </li>
            <li>
              <Link
                href="/categories?category=education"
                className="hover:text-white"
              >
                Education
              </Link>
            </li>
            <li>
              <Link
                href="/categories?category=food"
                className="hover:text-white"
              >
                Food
              </Link>
            </li>
            <li>
              <Link
                href="/categories?category=services"
                className="hover:text-white"
              >
                Services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold mb-4">Support</h3>
          <ul className="space-y-2 text-smtext-gray-500">
            <li>
              <Link href="/help-center" className="hover:text-white">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold mb-4">Newsletter</h3>
          <p className="text-smtext-gray-500 mb-4">
            Receive weekly updates on popular pamphlets.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white  outline-none focus:border-white/40"
            />
            <button
              type="button"
              className="rounded-lg bg-white text-brand-footer text-sm font-semibold px-4 py-2 hover:bg-gray-100"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 text-xstext-gray-500">
          © 2026 Pamphlets. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

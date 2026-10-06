import { Link } from "react-router-dom";
import { SectionWrapper } from "../hoc";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
    <p className="heading-display text-7xl text-accent-500">404</p>
    <h1 className="heading-display text-2xl text-ink">Page not found</h1>
    <p className="text-gray-500 text-sm max-w-sm">
      The page you&apos;re looking for doesn&apos;t exist or may have moved.
    </p>
    <Link
      to="/"
      className="mt-2 bg-ink text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-accent-600 hover:shadow-soft transition-all duration-250"
    >
      Back to Home
    </Link>
  </div>
);

export default SectionWrapper(NotFound, "not-found");

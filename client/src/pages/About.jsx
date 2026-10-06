import { Link } from "react-router-dom";
import { NewsLetterBox, FeatureSection } from "../components";
import { SectionWrapper } from "../hoc";
import { assets } from "../assets";
import { content } from "../constant";

const FEATURE_ICONS = ["✓", "✦", "♥"];

const STATS = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "120+", label: "Sustainable Styles" },
  { value: "4.8★", label: "Average Rating" },
  { value: "7-Day", label: "Easy Returns" },
];

const About = () => {
  const { aboutContent } = content;

  return (
    <>
      {/* Hero */}
      <div className="relative -mx-4 sm:-mx-[5vw] lg:-mx-[7vw] overflow-hidden bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900 px-4 sm:px-[5vw] lg:px-[7vw] py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="pointer-events-none absolute -top-24 -right-20 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <p className="uppercase tracking-[0.3em] text-accent-400 text-xs font-semibold mb-4">Our Story</p>
          <h1 className="heading-display text-4xl sm:text-5xl leading-[1.1] mb-5">
            {aboutContent.title1} {aboutContent.title2}
          </h1>
          <p className="text-navy-100/80 text-sm sm:text-base leading-relaxed">{aboutContent.section1Text}</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 border-b border-gray-100">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="heading-display text-2xl sm:text-3xl text-accent-600">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Story + image */}
      <div className="flex flex-col md:flex-row gap-16 items-center py-16">
        <img src={assets.about_img} alt="About us" className="w-full md:max-w-[450px] rounded-2xl shadow-soft" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>{aboutContent.section2Text}</p>
          <div className="bg-accent-50/60 border border-accent-100 rounded-2xl p-6">
            <strong className="heading-display text-lg text-ink block mb-2">{aboutContent.missionTitle}</strong>
            <p className="text-gray-600">{aboutContent.missionText}</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-4xl py-4 mt-4 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-accent-600 font-semibold mb-2">Why Webfarm&apos;s Wear</p>
        <h2 className="heading-display text-3xl text-ink">What sets us apart</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-5 text-sm my-10">
        {[
          aboutContent.qualityAssurance,
          aboutContent.convenience,
          aboutContent.customerService,
        ].map((feature, index) => (
          <FeatureSection
            key={index}
            title={feature.title}
            description={feature.description}
            icon={FEATURE_ICONS[index]}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center py-14 border-t border-gray-100 mt-10">
        <h2 className="heading-display text-2xl text-ink mb-3">Ready to find your next favorite piece?</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Explore the full collection — thoughtfully made, sustainably sourced.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-ink text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-accent-600 hover:shadow-soft transition-all duration-250"
        >
          Shop the Collection
        </Link>
      </div>

      <NewsLetterBox />
    </>
  );
};

export default SectionWrapper(About, "about");

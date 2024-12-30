import { Title, NewsLetterBox } from "../components";
import { SectionWrapper } from "../hoc";
import { assets } from "../assets";
import { content } from "../constant";
import {FeatureSection} from "../components"

const About = () => {
  const { aboutContent } = content;

  return (
    <>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={aboutContent.title1} text2={aboutContent.title2} />
      </div>

      {/* About Section */}
      <div className="flex flex-col md:flex-row gap-16">
        <img src={assets.about_img} alt="About us" className="w-full md:max-w-[450px]" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>{aboutContent.section1Text}</p>
          <p>{aboutContent.section2Text}</p>
          <strong className="text-gray-800">{aboutContent.missionTitle}</strong>
          <p>{aboutContent.missionText}</p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-4xl py-4">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        {[
          aboutContent.qualityAssurance,
          aboutContent.convenience,
          aboutContent.customerService,
        ].map((feature, index) => (
          <FeatureSection
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      <NewsLetterBox />
    </>
  );
};

export default SectionWrapper(About, "about");

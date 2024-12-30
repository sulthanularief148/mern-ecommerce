// Contact.js
import { assets } from "../assets";
import { NewsLetterBox, Title } from "../components";
import { SectionWrapper } from "../hoc";
import { contactContent } from "../constant";

const Contact = () => {
  return (
    <>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={contactContent.title.part1} text2={contactContent.title.part2} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img src={assets.contact_img} alt="Contact Us" className="w-full md:max-w-[480px]" />

        <div className="flex flex-col justify-center items-start gap-6">
          {/* Store Section */}
          <p className="font-semibold text-xl text-gray-600">{contactContent.store.title}</p>
          <p className="text-gray-500">{contactContent.store.address}</p>
          <p className="text-gray-500">
            {contactContent.store.phone} <strong>{contactContent.store.email}</strong>
          </p>

          {/* Careers Section */}
          <p className="font-semibold text-xl text-gray-600">{contactContent.careers.title}</p>
          <p className="text-gray-500">{contactContent.careers.description}</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            {contactContent.careers.buttonText}
          </button>
        </div>
      </div>

      <NewsLetterBox />
    </>
  );
};

export default SectionWrapper(Contact, "contact");

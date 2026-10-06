import { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets";
import { NewsLetterBox } from "../components";
import { SectionWrapper } from "../hoc";
import { contactContent } from "../constant";
import { handleAxiosError } from "../../utils/handleAxiosError";
import * as contactApi from "../services/contactApi";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const whatsappNumber = contactContent.store.phone.replace(/[^\d]/g, "");
  const mapQuery = encodeURIComponent(contactContent.store.address);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const message = await contactApi.submitContactForm(form);
      toast.success(message);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to send your message. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative -mx-4 sm:-mx-[5vw] lg:-mx-[7vw] overflow-hidden bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900 px-4 sm:px-[5vw] lg:px-[7vw] py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <p className="uppercase tracking-[0.3em] text-accent-400 text-xs font-semibold mb-4">Get in Touch</p>
          <h1 className="heading-display text-4xl sm:text-5xl leading-[1.1] mb-5">
            {contactContent.title.part1} {contactContent.title.part2}
          </h1>
          <p className="text-navy-100/80 text-sm sm:text-base leading-relaxed">
            Questions about an order, sizing, or anything else? We usually reply within 1-2 business days.
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col justify-center lg:flex-row gap-10 mb-16 items-start">
        <img src={assets.contact_img} alt="Contact Us" className="w-full lg:max-w-[420px] rounded-2xl shadow-soft" />

        <div className="flex-1 flex flex-col gap-5 w-full">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
            <p className="font-semibold text-lg text-ink mb-3">{contactContent.store.title}</p>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <p className="flex items-center gap-2">📍 {contactContent.store.address}</p>
              <a href={`tel:${whatsappNumber}`} className="flex items-center gap-2 hover:text-accent-600 transition-colors duration-250 w-fit">
                📞 {contactContent.store.phone}
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent-600 transition-colors duration-250 w-fit"
              >
                💬 Chat on WhatsApp
              </a>
              <a href={`mailto:${contactContent.store.email}`} className="flex items-center gap-2 text-accent-600 font-medium hover:text-accent-700 transition-colors duration-250 w-fit">
                ✉️ {contactContent.store.email}
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
            <p className="font-semibold text-lg text-ink mb-2">{contactContent.careers.title}</p>
            <p className="text-gray-500 text-sm mb-4">{contactContent.careers.description}</p>
            <a
              href={`mailto:${contactContent.store.email}?subject=${encodeURIComponent('Careers at Webfarm\'s Wear')}`}
              className="inline-block border border-ink text-ink px-8 py-2.5 text-sm rounded-full hover:bg-ink hover:text-white transition-colors duration-250"
            >
              {contactContent.careers.buttonText}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-10 bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <iframe
          title="Store location"
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-64 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="max-w-2xl mx-auto mb-24">
        <form onSubmit={onSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 sm:p-8 flex flex-col gap-4">
          <p className="heading-display text-xl text-ink mb-1">Send us a message</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              name="name" value={form.name} onChange={onChange} required
              type="text" placeholder="Your name"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-50 transition-colors duration-250"
            />
            <input
              name="email" value={form.email} onChange={onChange} required
              type="email" placeholder="Your email"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-50 transition-colors duration-250"
            />
          </div>
          <textarea
            name="message" value={form.message} onChange={onChange} required
            placeholder="How can we help?" rows={5}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-50 transition-colors duration-250"
          />
          <button
            type="submit"
            disabled={submitting}
            className="self-start px-8 py-3 text-sm bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>

      <NewsLetterBox />
    </>
  );
};

export default SectionWrapper(Contact, "contact");

import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionWrapper } from "../hoc";
import { Title } from "../components";

const FAQ_GROUPS = [
  {
    category: "Shipping",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery arrives in 4–6 business days (₹49, free over ₹999). Express delivery arrives in 1–2 business days (₹149)." },
      { q: "Do you ship all over India?", a: "Yes, we currently deliver across India. Remote pin codes may take slightly longer." },
      { q: "Can I track my order?", a: "Yes — open My Orders to see a live status tracker for every order, from Order Placed through to Delivered." },
    ],
  },
  {
    category: "Returns",
    items: [
      { q: "What's your return window?", a: "7 days from delivery, as long as the item is unused, unwashed, and has its original tags." },
      { q: "How do I start a return?", a: "Go to My Orders, select the item, and choose \"Request Return.\" See our Return & Refund Policy for full details." },
      { q: "When will I get my refund?", a: "Within 5–7 business days of us receiving and inspecting the returned item." },
    ],
  },
  {
    category: "Sizes",
    items: [
      { q: "How do I pick the right size?", a: "Most product pages include a Size Chart link next to the size selector with detailed measurements for each size." },
      { q: "What if it doesn't fit?", a: "You can exchange it for a different size within 7 days of delivery — select \"Exchange\" instead of \"Return\" on the order." },
    ],
  },
  {
    category: "Fabric",
    items: [
      { q: "Where can I see fabric details?", a: "Every product page has a \"Fabric & Care\" tab listing the fabric, composition, GSM (weight), and care instructions." },
      { q: "How should I wash my order?", a: "Care instructions vary by fabric and are listed on each product's Fabric & Care tab — always check before the first wash." },
    ],
  },
  {
    category: "Payments",
    items: [
      { q: "What payment methods do you accept?", a: "Credit/debit cards and popular wallets via Stripe or Razorpay, plus Cash on Delivery on eligible orders." },
      { q: "Is it safe to pay on this site?", a: "Yes — card details are handled entirely by Stripe/Razorpay, both PCI-DSS compliant. We never see or store your card number." },
    ],
  },
  {
    category: "COD",
    items: [
      { q: "Is Cash on Delivery available?", a: "Yes, COD is available at checkout for most pin codes and order values." },
      { q: "Can I cancel a COD order?", a: "Yes, free of charge any time before it ships — no refund is needed since no payment was collected yet." },
    ],
  },
  {
    category: "Orders",
    items: [
      { q: "Can I change my order after placing it?", a: "Contact us right away — we can usually adjust an order before it enters packing, but not once it has shipped." },
      { q: "I placed an order but didn't get a confirmation — what now?", a: "Check My Orders while logged in first; if it's not there, email support@webfarmswear.com with your details and we'll help." },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-ink">{q}</span>
        <span className={`text-accent-600 text-lg shrink-0 transition-transform duration-250 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="text-sm text-gray-500 pb-4 leading-relaxed">{a}</p>}
    </div>
  );
};

const FAQ = () => (
  <div className="border-t pt-14 pb-20 max-w-3xl mx-auto">
    <Title text1="FREQUENTLY ASKED" text2="QUESTIONS" />
    <p className="text-sm text-gray-500 mt-2 mb-8">
      Can't find what you're looking for? <Link to="/contact" className="text-accent-600 hover:underline">Contact us</Link> and we'll help.
    </p>

    <div className="flex flex-col gap-8 mt-4">
      {FAQ_GROUPS.map((group) => (
        <div key={group.category} className="bg-white border border-gray-100 rounded-2xl shadow-soft px-6">
          <p className="text-xs font-semibold tracking-wide text-accent-600 pt-5 pb-1">{group.category.toUpperCase()}</p>
          {group.items.map((item, i) => <FAQItem key={i} {...item} />)}
        </div>
      ))}
    </div>
  </div>
);

export default SectionWrapper(FAQ, "faq");

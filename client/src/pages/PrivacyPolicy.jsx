import { SectionWrapper } from "../hoc";
import PolicyLayout from "../components/PolicyLayout";

const sections = [
  {
    heading: "Information We Collect",
    paragraphs: ["When you create an account, browse, or place an order with us, we collect:"],
    list: [
      "Account details — name, email address, and password (stored as a secure hash, never in plain text)",
      "Order details — shipping address, phone number, items purchased, and order history",
      "Usage data — pages viewed, products browsed, and cart/wishlist activity, used to keep your session working correctly",
    ],
  },
  {
    heading: "What We Don't Store",
    paragraphs: [
      "We never see or store your full card number, CVV, or bank details. Payments are handled entirely by our payment processors, Stripe and Razorpay, both PCI-DSS compliant — your card details go directly to them, not through our servers.",
    ],
  },
  {
    heading: "How We Use Your Information",
    paragraphs: ["We use your information strictly to:"],
    list: [
      "Process and deliver your orders, and keep you updated on their status",
      "Provide customer support and respond to your enquiries",
      "Show you your own order history, wishlist, and saved details when you're logged in",
      "Improve our product catalogue and site experience",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "We use a small number of essential cookies to keep you signed in securely between visits. See our Cookie Policy for full details.",
    ],
  },
  {
    heading: "Third-Party Sharing",
    paragraphs: [
      "We share only what's necessary to fulfil your order: your address and contact details with our courier partners for delivery, and payment amounts with Stripe/Razorpay for processing. We never sell your personal information to third parties.",
    ],
  },
  {
    heading: "Your Rights",
    paragraphs: [
      "You can view and update your name at any time from your Profile page, and request a copy or deletion of your personal data by emailing support@webfarmswear.com. We'll respond within 30 days.",
    ],
  },
  {
    heading: "Data Security",
    paragraphs: [
      "Passwords are hashed with bcrypt, sessions use short-lived access tokens with rotating server-side refresh tokens, and all traffic to our site is encrypted in transit.",
    ],
  },
  {
    heading: "Changes to This Policy",
    paragraphs: [
      "If we make material changes to how we handle your data, we'll update the date at the top of this page and, where appropriate, notify you directly.",
    ],
  },
];

const PrivacyPolicy = () => (
  <PolicyLayout title1="PRIVACY" title2="POLICY" updatedAt="15 September 2026" sections={sections} />
);

export default SectionWrapper(PrivacyPolicy, "privacy-policy");

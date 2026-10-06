import { SectionWrapper } from "../hoc";
import PolicyLayout from "../components/PolicyLayout";

const sections = [
  {
    heading: "Acceptance of Terms",
    paragraphs: [
      "By creating an account or placing an order on Webfarm's Wear, you agree to these Terms & Conditions. If you don't agree with any part of them, please don't use the site.",
    ],
  },
  {
    heading: "Your Account",
    paragraphs: [
      "You're responsible for keeping your account password confidential and for all activity under your account. Let us know immediately at support@webfarmswear.com if you suspect unauthorised access.",
    ],
  },
  {
    heading: "Orders & Pricing",
    paragraphs: [
      "All prices are listed in Indian Rupees (₹) and include applicable taxes shown at checkout. We reserve the right to refuse or cancel any order — for example if a product is listed at an incorrect price due to an error, or if we suspect fraudulent activity — in which case any payment already collected will be fully refunded.",
    ],
  },
  {
    heading: "Product Descriptions",
    paragraphs: [
      "We do our best to accurately describe fabric, fit, and colour for every product. Slight variations in colour may occur due to display settings, and measurements listed in size charts are approximate.",
    ],
  },
  {
    heading: "Intellectual Property",
    paragraphs: [
      "All content on this site — including the Webfarm's Wear name, logo, product photography, and page design — is our property or used under licence, and may not be reproduced without written permission.",
    ],
  },
  {
    heading: "Limitation of Liability",
    paragraphs: [
      "Webfarm's Wear is not liable for indirect or consequential damages arising from the use of this site or its products, to the maximum extent permitted by law.",
    ],
  },
  {
    heading: "Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of India, and any disputes will be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.",
    ],
  },
  {
    heading: "Changes to These Terms",
    paragraphs: [
      "We may update these Terms from time to time. Continued use of the site after changes are posted means you accept the revised Terms.",
    ],
  },
];

const Terms = () => (
  <PolicyLayout title1="TERMS &" title2="CONDITIONS" updatedAt="15 September 2026" sections={sections} />
);

export default SectionWrapper(Terms, "terms");

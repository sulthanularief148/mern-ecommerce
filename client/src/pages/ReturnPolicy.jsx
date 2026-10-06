import { SectionWrapper } from "../hoc";
import PolicyLayout from "../components/PolicyLayout";

const sections = [
  {
    heading: "Return Window",
    paragraphs: [
      "We accept returns within 7 days of delivery. To be eligible, an item must be unused, unwashed, and in its original condition with all tags and packaging intact.",
    ],
  },
  {
    heading: "How to Start a Return",
    paragraphs: [
      "Go to My Orders, select the item you'd like to return, and choose \"Request Return.\" Our team will review the request and arrange a pickup where available, or share drop-off instructions.",
    ],
  },
  {
    heading: "Non-Returnable Items",
    paragraphs: ["For hygiene and quality reasons, the following can't be returned unless the item arrived damaged or defective:"],
    list: [
      "Innerwear and intimate apparel",
      "Items marked \"Final Sale\" or purchased with a steep clearance discount",
      "Products showing signs of wear, alteration, or washing",
    ],
  },
  {
    heading: "Refunds",
    paragraphs: [
      "Once we receive and inspect your return, we'll notify you of the approval status. Approved refunds are issued to your original payment method within 5–7 business days. For Cash on Delivery orders, refunds are made via bank transfer or store credit — whichever you prefer.",
    ],
  },
  {
    heading: "Exchanges",
    paragraphs: [
      "Need a different size or colour instead? Select \"Exchange\" rather than \"Return\" when starting your request and we'll ship the replacement as soon as the original item is received back, subject to availability.",
    ],
  },
  {
    heading: "Damaged or Incorrect Items",
    paragraphs: [
      "If an item arrives damaged, defective, or different from what you ordered, contact us within 48 hours of delivery with photos of the product and packaging — we'll prioritise a replacement or full refund at no extra cost to you.",
    ],
  },
];

const ReturnPolicy = () => (
  <PolicyLayout title1="RETURN &" title2="REFUND POLICY" updatedAt="15 September 2026" sections={sections} />
);

export default SectionWrapper(ReturnPolicy, "return-policy");

import { SectionWrapper } from "../hoc";
import PolicyLayout from "../components/PolicyLayout";

const sections = [
  {
    heading: "Order Processing",
    paragraphs: [
      "Orders are processed within 1–2 business days of payment confirmation (or order placement, for Cash on Delivery). You'll receive an email/order confirmation as soon as your order is placed, and your order status is always visible on the Orders page of your account.",
    ],
  },
  {
    heading: "Delivery Methods & Timelines",
    paragraphs: ["We currently offer two delivery options at checkout:"],
    list: [
      "Standard Delivery — ₹49 (free on orders over ₹999), arrives in 4–6 business days.",
      "Express Delivery — ₹149, arrives in 1–2 business days.",
    ],
  },
  {
    heading: "Delivery Areas",
    paragraphs: [
      "We currently ship across India. Delivery timelines may vary slightly for remote or non-serviceable pin codes, and our courier partner will contact you directly if there's a delay reaching your address.",
    ],
  },
  {
    heading: "Order Tracking",
    paragraphs: [
      "Every order includes a live status tracker — Order Placed, Packing, Shipped, Out for Delivery, and Delivered — visible on your Order Details page from the moment you check out.",
    ],
  },
  {
    heading: "Shipping Delays",
    paragraphs: [
      "While we make every effort to meet the estimated delivery windows above, delays can occasionally occur due to weather, courier network disruptions, or high-demand periods (festive sales, etc). We'll always keep your order status updated so you know exactly where things stand.",
    ],
  },
  {
    heading: "Questions?",
    paragraphs: [
      "Reach out any time at support@webfarmswear.com or through our Contact page and we'll help track down your order.",
    ],
  },
];

const ShippingPolicy = () => (
  <PolicyLayout title1="SHIPPING" title2="POLICY" updatedAt="15 September 2026" sections={sections} />
);

export default SectionWrapper(ShippingPolicy, "shipping-policy");

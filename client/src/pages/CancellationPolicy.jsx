import { SectionWrapper } from "../hoc";
import PolicyLayout from "../components/PolicyLayout";

const sections = [
  {
    heading: "Cancelling Before Dispatch",
    paragraphs: [
      "You can cancel an order free of charge any time before its status changes to \"Shipped.\" Simply go to My Orders and select \"Cancel Order,\" or contact our support team with your order number.",
    ],
  },
  {
    heading: "Cancelling After Dispatch",
    paragraphs: [
      "Once an order has shipped, it can no longer be cancelled — but you're welcome to refuse delivery or initiate a return once it arrives, following our Return & Refund Policy.",
    ],
  },
  {
    heading: "Refunds for Cancelled Orders",
    paragraphs: [
      "For prepaid orders (Stripe/Razorpay), cancellations are refunded to your original payment method within 5–7 business days. Cash on Delivery orders don't require a refund since no payment was collected yet.",
    ],
  },
  {
    heading: "Order Cancelled by Us",
    paragraphs: [
      "In rare cases — a stock discrepancy, a suspected fraudulent order, or an undeliverable address — we may need to cancel an order ourselves. We'll always notify you by email and issue a full refund immediately if payment was already collected.",
    ],
  },
];

const CancellationPolicy = () => (
  <PolicyLayout title1="CANCELLATION" title2="POLICY" updatedAt="15 September 2026" sections={sections} />
);

export default SectionWrapper(CancellationPolicy, "cancellation-policy");

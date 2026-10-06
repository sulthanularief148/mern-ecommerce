import { SectionWrapper } from "../hoc";
import PolicyLayout from "../components/PolicyLayout";

const sections = [
  {
    heading: "What Are Cookies",
    paragraphs: [
      "Cookies are small text files stored on your device that help websites remember information between visits, like whether you're logged in.",
    ],
  },
  {
    heading: "Cookies We Use",
    paragraphs: ["We keep this intentionally minimal — we don't use advertising or tracking cookies. The cookie we do use is:"],
    list: [
      "Refresh token cookie (httpOnly, secure) — keeps you signed in between visits without storing your password anywhere. It can't be read by JavaScript and is only sent to our own servers.",
    ],
  },
  {
    heading: "Local Storage",
    paragraphs: [
      "We also use your browser's local storage (not a cookie, but similar in spirit) to remember things like your recently viewed products, purely to improve your browsing experience on this device. This data never leaves your browser.",
    ],
  },
  {
    heading: "Managing Cookies",
    paragraphs: [
      "You can clear or block cookies at any time through your browser settings. Since our only cookie is what keeps you logged in, blocking it simply means you'll need to log in again each visit — the rest of the site will work normally.",
    ],
  },
];

const CookiePolicy = () => (
  <PolicyLayout title1="COOKIE" title2="POLICY" updatedAt="15 September 2026" sections={sections} />
);

export default SectionWrapper(CookiePolicy, "cookie-policy");

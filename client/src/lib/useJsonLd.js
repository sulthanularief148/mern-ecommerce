import { useEffect } from "react";

// No react-helmet dependency for just one script tag — inject/replace a
// single <script type="application/ld+json"> in <head> and clean it up when
// the data changes or the component unmounts, so structured data never
// stacks up across route changes in this SPA.
export function useJsonLd(data) {
  useEffect(() => {
    if (!data) return undefined;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [JSON.stringify(data)]);
}

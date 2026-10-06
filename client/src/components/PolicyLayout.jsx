import { Title } from "./Title";

const PolicyLayout = ({ title1, title2, updatedAt, sections }) => (
  <div className="border-t pt-14 pb-20 max-w-3xl mx-auto">
    <Title text1={title1} text2={title2} />
    {updatedAt && <p className="text-xs text-gray-400 -mt-2 mb-8">Last updated: {updatedAt}</p>}

    <div className="flex flex-col gap-8 mt-6">
      {sections.map((section, i) => (
        <div key={i}>
          <h2 className="heading-display text-lg text-ink mb-2">{section.heading}</h2>
          {section.paragraphs.map((p, j) => (
            <p key={j} className="text-sm text-gray-600 leading-relaxed mb-2">{p}</p>
          ))}
          {section.list && (
            <ul className="list-disc list-outside pl-5 text-sm text-gray-600 leading-relaxed flex flex-col gap-1 mt-2">
              {section.list.map((item, k) => <li key={k}>{item}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default PolicyLayout;

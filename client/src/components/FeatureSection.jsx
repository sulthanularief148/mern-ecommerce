// FeatureSection.js
const FeatureSection = ({ title, description }) => (
    <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
      <strong>{title}</strong>
      <p className="text-gray-800">{description}</p>
    </div>
  );
  
  export default FeatureSection;
  
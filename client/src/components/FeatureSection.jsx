const FeatureSection = ({ title, description, icon }) => (
    <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-soft hover:shadow-card transition-shadow duration-250 px-8 py-10 flex flex-col gap-4">
      {icon && (
        <div className="w-11 h-11 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center text-xl">
          {icon}
        </div>
      )}
      <strong className="text-ink text-lg">{title}</strong>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );

  export default FeatureSection;

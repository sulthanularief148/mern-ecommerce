const pillars = [
    { title: 'Organic Materials', desc: 'GOTS-certified cotton and low-impact dyes in every collection.' },
    { title: 'Ethical Production', desc: 'Fair-wage partner factories, audited every year.' },
    { title: 'Carbon-Conscious Shipping', desc: 'Offset delivery emissions on every order, automatically.' },
];

const SustainabilityBanner = () => (
    <div className="my-24 grid grid-cols-1 sm:grid-cols-2 rounded-2xl overflow-hidden">
        <div className="relative min-h-[320px] sm:min-h-[420px]">
            <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=75&auto=format&fit=crop"
                alt="Sustainable fashion craftsmanship"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
            />
        </div>
        <div className="bg-accent-50 flex flex-col justify-center px-8 py-12 sm:px-12">
            <p className="text-accent-600 text-sm tracking-[0.2em] font-medium mb-3">OUR COMMITMENT</p>
            <h2 className="heading-display text-3xl text-ink mb-4">Fashion that treads lightly</h2>
            <p className="text-gray-600 text-sm mb-8 max-w-sm">
                Every Webfarm's Wear piece is made with the planet in mind — from the fibers we choose to the hands that make them.
            </p>
            <div className="flex flex-col gap-5">
                {pillars.map((p) => (
                    <div key={p.title} className="flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-ink">{p.title}</p>
                            <p className="text-sm text-gray-500">{p.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default SustainabilityBanner;

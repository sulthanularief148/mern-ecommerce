import { useRef, useState } from "react";

const isDirectVideoFile = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || "");

const ProductImageZoom = ({ images = [], videoUrl, name }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showVideo, setShowVideo] = useState(false);
    const [zoomStyle, setZoomStyle] = useState({ display: "none" });
    const containerRef = useRef(null);

    const activeImage = images[activeIndex] || images[0];

    const handleMouseMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomStyle({
            display: "block",
            backgroundImage: `url(${activeImage})`,
            backgroundPosition: `${x}% ${y}%`,
        });
    };

    return (
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:w-[18.7%] w-full sm:overflow-y-scroll justify-between sm:justify-normal gap-2 sm:gap-0">
                {images.map((item, index) => (
                    <img
                        onClick={() => { setActiveIndex(index); setShowVideo(false); }}
                        src={item}
                        key={index}
                        alt={`${name} thumbnail ${index + 1}`}
                        className={`w-24% sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-2xl transition-opacity duration-250 ${!showVideo && activeIndex === index ? '' : 'opacity-70 hover:opacity-100'}`}
                    />
                ))}
                {videoUrl && (
                    <button
                        type="button"
                        onClick={() => setShowVideo(true)}
                        className={`w-24% sm:w-full sm:mb-3 flex-shrink-0 rounded-2xl border flex items-center justify-center aspect-square transition-colors duration-250 ${showVideo ? 'border-accent-500 bg-accent-50' : 'border-gray-200 hover:border-gray-400'}`}
                        aria-label="Play product video"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="w-full sm:w-[80%]">
                {showVideo && videoUrl ? (
                    isDirectVideoFile(videoUrl) ? (
                        <video src={videoUrl} controls autoPlay className="w-full h-auto rounded-2xl bg-black" />
                    ) : (
                        <iframe
                            src={videoUrl}
                            title={`${name} video`}
                            className="w-full aspect-video rounded-2xl"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    )
                ) : (
                    <div
                        ref={containerRef}
                        className="relative w-full overflow-hidden rounded-2xl cursor-zoom-in"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setZoomStyle({ display: "none" })}
                    >
                        <img src={activeImage} className="w-full h-auto rounded-2xl" alt={name} />
                        <div
                            className="hidden sm:block absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                                ...zoomStyle,
                                backgroundSize: "200%",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductImageZoom;

const Logo = ({ size = 'md', className = '', variant = 'dark' }) => {
    const markSize = size === 'lg' ? 'w-9 h-9' : size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
    const wordmarkSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';
    const taglineSize = size === 'lg' ? 'text-[11px]' : 'text-[9px]';
    const isLight = variant === 'light';

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg viewBox="0 0 24 24" className={`${markSize} shrink-0`} fill="none">
                <path
                    d="M3 19L7.5 6L12 16L16.5 6L21 19"
                    stroke={isLight ? '#E6CE8F' : '#C9A24B'}
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <div className="flex flex-col leading-none">
                <span className={`${isLight ? 'text-white' : 'text-ink'} font-bold ${wordmarkSize}`}>Webfarm&apos;s</span>
                <span className={`font-semibold tracking-[0.25em] ${isLight ? 'text-accent-400' : 'text-accent-600'} ${taglineSize} mt-0.5`}>WEAR ADMIN</span>
            </div>
        </div>
    );
};

export default Logo;

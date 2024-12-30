const SectionWrapper = (Component, idName) =>
    function HOC() {
        return (
            <section className={`max-w-7xl mx-auto relative z-0`} id={idName}>
                <Component />
            </section>
        );
    };
export default SectionWrapper;

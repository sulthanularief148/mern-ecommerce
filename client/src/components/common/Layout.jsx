import { Header, Footer, SearchBar } from "..";


const Layout = ({ children }) => {
    return (
        <>
            <header>

                <Header />
                <SearchBar />
            </header>

            <main>{children}</main>

            <footer className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                <Footer />
            </footer>
        </>
    );
};

export default Layout;

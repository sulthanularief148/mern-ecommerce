import { Link } from "react-router-dom"
import { SubTitle, Title } from "../Title"
import { footerContent } from "../../constant"
import ChatBot from "../ChatBot"
import Logo from "../Logo"

const companyLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about" },
    { name: "Shop", to: "/shop" },
    { name: "Contact", to: "/contact" },
    { name: "FAQ", to: "/faq" },
]

const legalLinks = [
    { name: "Shipping Policy", to: "/shipping-policy" },
    { name: "Return & Refund Policy", to: "/return-policy" },
    { name: "Cancellation Policy", to: "/cancellation-policy" },
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Terms & Conditions", to: "/terms" },
    { name: "Cookie Policy", to: "/cookie-policy" },
]

const Footer = () => {

    return (
        <>
            <div>
                <Logo size="lg" className="mb-5" />
                <SubTitle subtitle={footerContent.subtitle} className="w-full !mx-0 text-left" />
            </div>

            <div>
                <Title text1="COMPANY" className="text-ink text-lg" withBorder={false} />
                <ul className="flex flex-col gap-2 text-gray-500 mt-2">
                    {companyLinks.map(item => (
                        <li key={item.name}>
                            <Link to={item.to} className="hover:text-accent-600 transition-colors duration-250 w-fit block">{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <Title text1="LEGAL" className="text-ink text-lg" withBorder={false} />
                <ul className="flex flex-col gap-2 text-gray-500 mt-2">
                    {legalLinks.map(item => (
                        <li key={item.name}>
                            <Link to={item.to} className="hover:text-accent-600 transition-colors duration-250 w-fit block">{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <Title text1="GET IN TOUCH" className="text-ink text-lg" withBorder={false} />
                <ul className="flex flex-col gap-2 text-gray-500 mt-2">
                    {footerContent.contact.map(item => (
                        <li key={item.id}>{item.info}</li>
                    ))}
                </ul>
            </div>

            <div className="col-span-full">
                <hr className="border-gray-200" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-5">
                    <SubTitle subtitle={footerContent.copyright} className="text-gray-500 w-full text-sm !mx-0 text-left" />
                    <p className="text-gray-400 text-sm shrink-0">
                        Developed by{' '}
                        <a
                            href="https://webfarmtech.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-600 hover:text-accent-700 font-medium transition-colors duration-250"
                        >
                            WebFarm Technology
                        </a>
                    </p>
                </div>
            </div>
            <ChatBot />
        </>
    )
}



export default Footer

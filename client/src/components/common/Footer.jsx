import { SubTitle, Title } from "../Title"
import { footerContent } from "../../constant"
import ChatBot from "../ChatBot"

const Footer = () => {

    return (
        <>
            <div>
                <img src={footerContent.logo} alt="Logo" className="mb-5 w-32" />
                <SubTitle subtitle={footerContent.subtitle} className="w-full" />
            </div>

            <div>
                <Title text1="COMPANY" className="text-black text-2xl" />
                <ul className="flex flex-col gap-1 text-gray-600">
                    {footerContent.company.map(item => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            </div>

            <div>
                <Title text1="GET IN TOUCH" className="text-black text-2xl" />
                <ul className="flex flex-col gap-1 text-gray-600">
                    {footerContent.contact.map(item => (
                        <li key={item.id}>{item.info}</li>
                    ))}
                </ul>
            </div>

            <div>
                <hr />
                <SubTitle subtitle={footerContent.copyright} className="text-gray-600 w-full text-sm" />
            </div>
            <ChatBot />
        </>
    )
}



export default Footer
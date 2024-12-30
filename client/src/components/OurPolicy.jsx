import { SubTitle } from './Title'
import { policies } from '../constant'

const OurPolicy = () => {
    return (
        <div className='flex flex-col sm:flex-row justify-around gap-12 m:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
            <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
                {policies.map((policy, index) => (
                    <PolicyContainer
                        key={index}
                        image={policy.image}
                        text1={policy.text1}
                        text2={policy.text2}
                    />
                ))}
            </div>
        </div>
    )
}


const PolicyContainer = ({ text1, image, text2 }) => {
    return (
        (<div>
            <img src={image} alt='' className='w-12 m-auto mb-5' />
            <SubTitle subtitle={text1} className="w-full font-semibold" />
            <SubTitle className=" w-full text-gray-400" subtitle={text2} />
        </div>)
    );
}
export default OurPolicy
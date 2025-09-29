import React from 'react'
import { heroContent } from '../constant'
import { ThickTitleBorder, ThinTitleBorder } from './Title'


const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400F'>
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                <div className='text-[#414141]'>
                    <div className='flex items-center gap-2'>
                        <ThickTitleBorder />
                        <p>{heroContent.bestSeller}</p>
                    </div>
                    <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
                        {heroContent.title}
                    </h1>
                    <div className='flex items-center gap-2'>
                        <p>{heroContent.shopNow}</p>
                        <ThinTitleBorder />
                    </div>
                </div>
            </div>
            <img src="https://stage-cdnblog.dataweave.com/wp-content/uploads/2022/07/sf-hero@1x-min-e1688037120365.jpg" alt='hero-img' className='w-full sm:w-1/2' />
        </div>
    )
}

export default Hero

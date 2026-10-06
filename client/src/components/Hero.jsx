import React from 'react'
import { heroContent } from '../constant'
import { Link } from 'react-router-dom'
import StarRating from './StarRating'

const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row items-stretch rounded-2xl overflow-hidden bg-accent-50/50 shadow-soft'>
            <div className='w-full sm:w-1/2 flex items-center justify-center py-14 sm:py-0 px-6 sm:px-12'>
                <div className='text-ink max-w-md'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 h-[2px] bg-accent-500 md:w-11'></p>
                        <p className='text-sm tracking-[0.2em] text-accent-600 font-medium'>{heroContent.bestSeller}</p>
                    </div>
                    <h1 className='heading-display text-4xl sm:py-4 lg:text-6xl leading-tight'>
                        {heroContent.title}
                    </h1>
                    <p className='text-sm sm:text-base text-gray-600 mb-6 max-w-sm'>
                        Thoughtfully made, sustainably sourced — the new season collection is here.
                    </p>
                    <div className='flex items-center gap-5'>
                        <Link
                            to='/shop'
                            className='inline-flex items-center bg-ink text-white text-sm font-medium tracking-wide px-7 py-3 rounded-full hover:bg-accent-600 transition-colors duration-250'
                        >
                            {heroContent.shopNow}
                        </Link>
                        <Link to='/about' className='text-sm font-medium text-ink border-b border-ink/40 hover:border-ink pb-0.5 transition-colors duration-250'>
                            Our Story
                        </Link>
                    </div>
                </div>
            </div>
            <div className='w-full sm:w-1/2 relative'>
                <img src={heroContent.heroImage} alt='Latest arrivals' className='w-full h-full object-cover max-h-[420px] sm:max-h-none' />
                <div className='hidden sm:flex absolute left-6 bottom-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-card px-4 py-3 items-center gap-3'>
                    <StarRating rating={4.8} />
                    <p className='text-xs text-gray-600 font-medium'>Loved by 50,000+ customers</p>
                </div>
            </div>
        </div>
    )
}

export default Hero

import React from 'react'
import { SubTitle, Title } from './Title'
import { newsLetterContent } from '../constant'


const NewsLetterBox = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault()
  }

  return (
    <div className='text-center'>
      {/* Title */}
      <Title className="font-bold text-black text-2xl" text1={newsLetterContent.title} />

      {/* Subtitle */}
      <SubTitle className="text-xl" subtitle={newsLetterContent.subtitle} />

      {/* Newsletter Form */}
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input
          type="email"
          placeholder={newsLetterContent.form.placeholder}
          className='w-full sm:flex-1 outline-none p-2'
          required
        />
        <button className='bg-black text-white text-xs px-10 py-4 font-bold'>
          {newsLetterContent.form.buttonText}
        </button>
      </form>
    </div>
  )
}

export default NewsLetterBox

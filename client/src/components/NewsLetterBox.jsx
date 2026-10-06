import { useState } from 'react'
import { toast } from 'react-toastify'
import { SubTitle, Title } from './Title'
import { newsLetterContent } from '../constant'

const NewsLetterBox = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmitHandler = (e) => {
    e.preventDefault()
    toast.success("You're subscribed! Watch your inbox for the 20% off code.")
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className='text-center'>
      {/* Title */}
      <Title className="font-bold text-black text-2xl" text1={newsLetterContent.title} />

      {/* Subtitle */}
      <SubTitle className="text-xl" subtitle={newsLetterContent.subtitle} />

      {/* Newsletter Form */}
      {submitted ? (
        <p className='my-6 text-accent-600 text-sm font-medium'>Thanks for subscribing — check your inbox soon!</p>
      ) : (
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gray-300 rounded-full pl-5 focus-within:border-accent-500 transition-colors duration-250'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsLetterContent.form.placeholder}
            className='w-full sm:flex-1 outline-none p-2 bg-transparent'
            required
          />
          <button className='bg-ink text-white text-xs px-10 py-4 font-bold rounded-full hover:bg-accent-600 transition-colors duration-250'>
            {newsLetterContent.form.buttonText}
          </button>
        </form>
      )}
    </div>
  )
}

export default NewsLetterBox

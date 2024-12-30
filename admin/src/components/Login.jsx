import React, { useState } from 'react'
import { backendurl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            const response = await axios.post(`${backendurl}/api/user/admin`, { email, password })
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message)
                console.log("Login Failed")
            }


        } catch (error) {
            toast.error(error)
            console.log(error)
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='shadow-md bg-white rounded-lg px-8 py-6 max-w-md'>
                <h1 className='mb-4 text-2xl font-bold'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium'>Username:</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" name="email" placeholder="Enter your email" required />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium'>Password:</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" name="password" placeholder="Enter your password" required />
                    </div>
                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type='submit'>Login</button>

                </form>
            </div>
        </div>
    )
}

export default Login
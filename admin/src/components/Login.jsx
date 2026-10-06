import { useState } from 'react'
import Logo from './Logo'
import { api, setAccessToken } from '../lib/apiClient'
import { toast } from 'react-toastify'
import { handleAxiosError } from '../utils/handleAxiosError'

const MailIcon = () => (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
    </svg>
)
const LockIcon = () => (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
        <path strokeLinecap="round" d="M7.5 10.5V7.5a4.5 4.5 0 019 0v3" />
    </svg>
)
const EyeIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
        {open ? (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.6 5.1A10.9 10.9 0 0112 5c7 0 10.5 7 10.5 7a13.7 13.7 0 01-3.1 3.9M6.6 6.6C3.4 8.6 1.5 12 1.5 12s3.5 7 10.5 7a10.6 10.6 0 004.4-.9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 9.9a3 3 0 004.2 4.2" />
            </>
        )}
    </svg>
)

const Login = ({ setUser }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [reveal, setReveal] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await api.post('/api/auth/login', { email, password })
            const { user, accessToken } = response.data.data
            if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                toast.error('This account does not have admin access')
                return
            }
            setAccessToken(accessToken)
            setUser(user)
        } catch (error) {
            toast.error(handleAxiosError(error, "Login Failed"))
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900 px-4">
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />
            <div className="pointer-events-none absolute -top-32 -right-20 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-accent-400/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-[380px]">
                <div className="flex justify-center mb-8">
                    <Logo size="lg" variant="light" />
                </div>

                <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-7 py-8 sm:px-9">
                    <p className="text-xs uppercase tracking-[0.25em] text-accent-400 font-semibold mb-1.5">Control Panel</p>
                    <h1 className="text-2xl font-semibold text-white mb-6">Admin sign in</h1>

                    <form onSubmit={onSubmitHandler} className="flex flex-col gap-3.5">
                        <div className="flex items-center border border-white/15 rounded-xl bg-white/5 focus-within:bg-white/10 focus-within:border-accent-400/60 transition-colors duration-250">
                            <span className="pl-3.5 text-white/40"><MailIcon /></span>
                            <div className="flex-1 px-3 pt-4 pb-1.5 min-w-0">
                                <label className="block text-[10px] uppercase tracking-wide text-white/40 mb-0.5">Email</label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)} value={email}
                                    className="w-full bg-transparent outline-none border-none text-sm text-white"
                                    type="email" name="email" autoComplete="email" required
                                />
                            </div>
                        </div>

                        <div className="flex items-center border border-white/15 rounded-xl bg-white/5 focus-within:bg-white/10 focus-within:border-accent-400/60 transition-colors duration-250">
                            <span className="pl-3.5 text-white/40"><LockIcon /></span>
                            <div className="flex-1 px-3 pt-4 pb-1.5 min-w-0">
                                <label className="block text-[10px] uppercase tracking-wide text-white/40 mb-0.5">Password</label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)} value={password}
                                    className="w-full bg-transparent outline-none border-none text-sm text-white"
                                    type={reveal ? 'text' : 'password'} name="password" autoComplete="current-password" required
                                />
                            </div>
                            <button
                                type="button" onClick={() => setReveal((r) => !r)} tabIndex={-1}
                                className="pr-3.5 text-white/40 hover:text-white transition-colors duration-250"
                                aria-label={reveal ? 'Hide password' : 'Show password'}
                            >
                                <EyeIcon open={reveal} />
                            </button>
                        </div>

                        <button
                            disabled={loading}
                            className="mt-3 w-full py-3 rounded-xl text-navy-900 font-semibold bg-accent-400 hover:bg-accent-300 hover:shadow-lg transition-all duration-250 disabled:opacity-60"
                            type="submit"
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-white/30 mt-6">Restricted to authorized store administrators.</p>
            </div>
        </div>
    )
}

export default Login

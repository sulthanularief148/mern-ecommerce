import Logo from './Logo'
import { api, setAccessToken } from '../lib/apiClient'
import { toast } from 'react-toastify'

const Navbar = ({ user, setUser }) => {
    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout')
        } catch {
            // Even if the network call fails, drop local auth state below.
        } finally {
            setAccessToken(null)
            setUser(null)
            toast.success('Logged out')
        }
    }

    const initials = user?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

    return (
        <div className='flex items-center py-3 px-[4%] justify-between border-b border-gray-100 bg-white sticky top-0 z-10'>
            <Logo />
            <div className='flex items-center gap-4'>
                {user && (
                    <div className='hidden sm:flex items-center gap-2.5'>
                        <div className='w-8 h-8 rounded-full bg-accent-100 text-accent-700 text-xs font-semibold flex items-center justify-center'>
                            {initials || '?'}
                        </div>
                        <div className='leading-tight'>
                            <p className='text-sm text-ink font-medium'>{user.name}</p>
                            <p className={`text-[10px] font-semibold uppercase tracking-wide ${user.role === 'SUPER_ADMIN' ? 'text-accent-600' : 'text-gray-400'}`}>
                                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                            </p>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} className='bg-ink hover:bg-accent-600 transition-colors duration-250 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
            </div>
        </div>
    )
}

export default Navbar

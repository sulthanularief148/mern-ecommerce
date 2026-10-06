import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7" />
      <path strokeLinecap="round" d="M12 11v10" />
    </svg>
  ),
  customers: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" /><path strokeLinecap="round" d="M3.5 19c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <circle cx="17.5" cy="8.5" r="2.4" /><path strokeLinecap="round" d="M15.5 13.3c2.4.2 4.5 2.2 4.5 5.2" />
    </svg>
  ),
  reviews: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.9 6.3 6.6.7-5 4.6 1.4 6.6L12 16.9 6.1 20.2 7.5 13.6l-5-4.6 6.6-.7z" />
    </svg>
  ),
  coupon: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41L11 3.83A2 2 0 0 0 9.57 3.24L4 3a1 1 0 0 0-1 1l.24 5.57a2 2 0 0 0 .59 1.42l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.81z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  discount: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l7 16 2-7 7-2L4 4z" />
    </svg>
  ),
  banner: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="12" rx="1.5" /><path strokeLinecap="round" d="M3 17l5-5 4 3 4-4 5 6" />
    </svg>
  ),
  collection: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 6a2 2 0 012-2h12a2 2 0 012 2M4 6v13a2 2 0 002 2h12a2 2 0 002-2V6" />
      <path strokeLinecap="round" d="M9 11h6" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  adminUsers: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15c-4 0-7 2-7 4.5V21h14v-1.5c0-2.5-3-4.5-7-4.5z" />
      <circle cx="12" cy="7.5" r="4" />
      <path strokeLinecap="round" d="M18 8l1.5 1.5L22 7" />
    </svg>
  ),
  returns: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11a5 5 0 010 10H9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 6l-4 4 4 4" />
    </svg>
  ),
  questions: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  add: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v8M8 12h8" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 2l1.5 3h9L18 2" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path strokeLinecap="round" d="M9 11h6M9 15h4" />
    </svg>
  ),
}

// (label, path, icon, search-keywords) — kept flat so the search box below
// can filter across every destination regardless of which group it lives in.
const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', icon: 'dashboard', label: 'Dashboard' }],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/add', icon: 'add', label: 'Add Items' },
      { to: '/list', icon: 'list', label: 'List Items' },
      { group: 'Inventory', icon: 'inventory', basePath: '/inventory', items: [
        { to: '/inventory/stock', label: 'Stock' },
        { to: '/inventory/low-stock', label: 'Low Stock' },
        { to: '/inventory/adjust', label: 'Stock Adjustment' },
      ] },
      { to: '/collections', icon: 'collection', label: 'Collections' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/orders', icon: 'orders', label: 'Orders' },
      { to: '/coupons', icon: 'coupon', label: 'Coupons' },
      { to: '/discounts', icon: 'discount', label: 'Discounts' },
      { to: '/returns', icon: 'returns', label: 'Returns' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { to: '/customers', icon: 'customers', label: 'Customers' },
      { to: '/reviews', icon: 'reviews', label: 'Reviews' },
      { to: '/questions', icon: 'questions', label: 'Questions' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { to: '/banners', icon: 'banner', label: 'Banners' },
      { group: 'Reports', icon: 'reports', basePath: '/reports', items: [
        { to: '/reports/sales', label: 'Sales' },
        { to: '/reports/products', label: 'Products' },
        { to: '/reports/customers', label: 'Customers' },
        { to: '/reports/inventory', label: 'Inventory' },
      ] },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { to: '/settings', icon: 'settings', label: 'Settings' },
      { to: '/admin-users', icon: 'adminUsers', label: 'Admin Users', superAdminOnly: true },
    ],
  },
]

const Item = ({ to, icon, iconSrc, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-250 ${
      isActive ? 'bg-accent-50 text-accent-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-ink'
    }`}
  >
    {iconSrc ? <img src={iconSrc} alt="" className="w-5 h-5 shrink-0" /> : <span className="shrink-0">{ICONS[icon]}</span>}
    <span className="hidden md:block truncate">{label}</span>
  </NavLink>
)

const Group = ({ label, icon, basePath, children }) => {
  const location = useLocation()
  const isOpenByRoute = location.pathname.startsWith(basePath)
  const [open, setOpen] = useState(isOpenByRoute)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-250 ${isOpenByRoute ? 'text-ink font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
      >
        <span className="flex items-center gap-3">
          <span className="shrink-0">{ICONS[icon]}</span>
          <span className="hidden md:block">{label}</span>
        </span>
        <svg viewBox="0 0 24 24" className={`hidden md:block w-3.5 h-3.5 transition-transform duration-250 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="hidden md:flex flex-col gap-0.5 mt-1 ml-4 pl-4 border-l border-gray-100">
          {children}
        </div>
      )}
    </div>
  )
}

const SubItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `px-3 py-2 rounded-lg text-sm transition-colors duration-250 ${
      isActive ? 'text-accent-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-ink'
    }`}
  >
    {label}
  </NavLink>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.3-4.3" />
  </svg>
)

const Sidebar = ({ isSuperAdmin }) => {
  const [query, setQuery] = useState('')

  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    return NAV_SECTIONS.map((section) => {
      const items = section.items
        .filter((item) => !item.superAdminOnly || isSuperAdmin)
        .filter((item) => {
          if (!q) return true
          if (item.group) return item.group.toLowerCase().includes(q) || item.items.some((sub) => sub.label.toLowerCase().includes(q))
          return item.label.toLowerCase().includes(q)
        })
      return { ...section, items }
    }).filter((section) => section.items.length > 0)
  }, [query, isSuperAdmin])

  return (
    <div className='w-[18%] min-h-screen bg-white border-r border-gray-100 overflow-y-auto'>
      <div className='flex flex-col gap-5 pt-6 px-3 pb-10'>
        <div className='hidden md:flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus-within:bg-white focus-within:border-accent-400 transition-colors duration-250'>
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Quick find…'
            className='w-full bg-transparent outline-none text-sm text-ink placeholder:text-gray-400'
          />
        </div>

        {visibleSections.length === 0 ? (
          <p className='hidden md:block text-sm text-gray-400 px-3'>No matches for &quot;{query}&quot;</p>
        ) : (
          visibleSections.map((section) => (
            <div key={section.label} className='flex flex-col gap-1'>
              <p className='hidden md:block px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1'>
                {section.label}
              </p>
              {section.items.map((item) =>
                item.group ? (
                  <Group key={item.group} label={item.group} icon={item.icon} basePath={item.basePath}>
                    {item.items.map((sub) => <SubItem key={sub.to} to={sub.to} label={sub.label} />)}
                  </Group>
                ) : (
                  <Item key={item.to} to={item.to} icon={item.icon} iconSrc={item.iconSrc} label={item.label} />
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar

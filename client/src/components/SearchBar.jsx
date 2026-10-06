import React, { useContext, useMemo, useRef, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets'
import { useNavigate } from 'react-router-dom'
import { listingImage } from '../lib/productImage'

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch, products, currency } = useContext(ShopContext)
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const suggestions = useMemo(() => {
    if (!search.trim()) return []
    const q = search.trim().toLowerCase()
    return products.filter((p) =>
      p.name.toLowerCase().includes(q)
      || p.category?.toLowerCase().includes(q)
      || p.subCategory?.toLowerCase().includes(q)
      || p.fabric?.toLowerCase().includes(q)
      || p.collectionName?.toLowerCase().includes(q)
      || p.sku?.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [search, products])

  if (!showSearch) return null

  const goToProduct = (id) => {
    setShowSearch(false)
    setFocused(false)
    navigate(`/product/${id}`)
  }

  const submitSearch = (e) => {
    e.preventDefault()
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div className='border-t border-b bg-gray-50'>
      <form onSubmit={submitSearch} className='flex flex-col items-center py-3 relative'>
        <div className='inline-flex items-center justify-center border border-gray-300 focus-within:border-accent-500 transition-colors duration-250 px-5 py-2 mx-5 rounded-full w-3/4 sm:w-1/2 bg-white'>
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            type="text"
            className='flex-1 outline-none bg-inherit text-sm'
            placeholder='Search for products...'
            autoFocus
          />
          <img src={assets.search_icon} className='w-4' alt="" />
        </div>
        <img
          src={assets.cross_icon}
          className='absolute right-6 top-1/2 -translate-y-1/2 w-3 cursor-pointer sm:right-[25%]'
          onClick={() => { setShowSearch(false); setSearch(''); }}
          alt="Close search"
        />

        {focused && suggestions.length > 0 && (
          <div className='absolute top-[calc(100%-4px)] w-[90%] sm:w-1/2 bg-white border border-gray-200 rounded-2xl shadow-card z-30 overflow-hidden'>
            {suggestions.map((p) => (
              <div
                key={p.id}
                onMouseDown={() => goToProduct(p.id)}
                className='flex items-center gap-3 px-4 py-2 hover:bg-accent-50 cursor-pointer transition-colors duration-150'
              >
                <img src={listingImage(p.images?.[0])} alt={p.name} className='w-10 h-10 object-cover rounded-xl' />
                <div className='flex-1 text-left'>
                  <p className='text-sm text-ink'>{p.name}</p>
                  <p className='text-xs text-gray-400'>{p.category} · {p.subCategory}</p>
                </div>
                <p className='text-sm text-gray-600'>{currency}{p.price}</p>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar

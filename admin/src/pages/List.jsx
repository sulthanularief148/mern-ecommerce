import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../lib/apiClient'
import { downloadBlob } from '../lib/downloadBlob'
import { handleAxiosError } from '../utils/handleAxiosError'

const List = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/products/list')
      setList(response.data.data.products || [])
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to load products"))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await api.post('/api/products/remove', { id })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      }
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to remove product"))
      console.error(error)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const exportCsv = async () => {
    try {
      const response = await api.get('/api/products/admin/export', { responseType: 'blob' })
      downloadBlob(response.data, `products-${new Date().toISOString().slice(0, 10)}.csv`)
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to export products'))
    }
  }

  const onImportFileChosen = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/api/products/admin/import', formData)
      const { created, updated, errors } = response.data.data
      if (errors.length > 0) {
        toast.warn(`Imported: ${created} created, ${updated} updated. ${errors.length} row(s) had errors — see console.`)
        console.warn('CSV import errors:', errors)
      } else {
        toast.success(`Imported: ${created} created, ${updated} updated`)
      }
      await fetchList()
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to import CSV'))
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-lg font-medium'>All Products List</p>
        <div className='flex items-center gap-2'>
          <button
            type="button"
            onClick={exportCsv}
            className='text-xs px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-250'
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className='text-xs px-4 py-2 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60'
          >
            {importing ? 'Importing…' : 'Import CSV'}
          </button>
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={onImportFileChosen} className='hidden' />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2.5 px-4 rounded-xl bg-white border border-gray-100 shadow-soft text-sm font-medium text-gray-500'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-center'>Action</b>
        </div>
        {loading ? (
          <p className='py-8 text-center text-gray-400'>Loading products…</p>
        ) : list.length > 0 ? (list.map((product) => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 bg-white border border-gray-100 rounded-xl shadow-soft hover:shadow-card text-sm transition-shadow duration-250' key={product.id}>
            {product.images && <img className='w-12 h-12 object-cover rounded-xl' src={product.images[0]} alt="" />}
            <p>{product.name}</p>
            <p>{product.category}</p>
            <p className='flex items-center gap-1.5'>
              {`₹`}{product.price}
              {product.compareAtPrice > product.price && (
                <span className='text-xs text-gray-400 line-through'>₹{product.compareAtPrice}</span>
              )}
            </p>
            <p className={product.stock <= 5 ? 'text-red-500 font-medium' : ''}>{product.stock ?? '—'}</p>
            <div className='flex items-center justify-end md:justify-center gap-3'>
              <Link to={`/edit/${product.id}`} className='text-xs text-accent-600 hover:text-accent-700 hover:underline'>Edit</Link>
              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className='text-lg text-gray-400 hover:text-red-500 transition-colors duration-250'
                aria-label='Remove product'
              >
                {`×`}
              </button>
            </div>
          </div>
        ))) : <p className='py-8 text-center text-gray-400'>No Products Found</p>}
      </div>
    </>
  )
}

export default List;

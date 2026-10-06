import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';
import SizeChartEditor from '../components/SizeChartEditor';

const CATEGORY_OPTIONS = ['Men', 'Women', 'Kids', 'Accessories'];
const SUBCATEGORY_OPTIONS = ['Topwear', 'Bottomwear', 'Winterwear', 'Footwear', 'Bags'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'One Size'];

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([null, null, null, null]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Topwear');
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [sku, setSku] = useState('');
  const [fabric, setFabric] = useState('');
  const [fabricComposition, setFabricComposition] = useState('');
  const [pattern, setPattern] = useState('');
  const [color, setColor] = useState('');
  const [occasion, setOccasion] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [gsm, setGsm] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [sizeChart, setSizeChart] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        const p = res.data.data.product;
        setExistingImages(p.images || []);
        setName(p.name || '');
        setDescription(p.description || '');
        setPrice(p.price ?? '');
        setCompareAtPrice(p.compareAtPrice ?? '');
        setStock(p.stock ?? '');
        setCategory(p.category || 'Men');
        setSubCategory(p.subCategory || 'Topwear');
        setSizes(p.sizes || []);
        setBestSeller(!!p.bestseller);
        setSku(p.sku || '');
        setFabric(p.fabric || '');
        setFabricComposition(p.fabricComposition || '');
        setPattern(p.pattern || '');
        setColor(p.color || '');
        setOccasion(p.occasion || '');
        setCollectionName(p.collectionName || '');
        setGsm(p.gsm ?? '');
        setDimensions(p.dimensions || '');
        setCareInstructions(p.careInstructions || '');
        setSizeChart(p.sizeChart || null);
      } catch (error) {
        toast.error(handleAxiosError(error, 'Failed to load product'));
        navigate('/list');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleNewImageChange = (index, file) => {
    setNewImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const totalImageCount = existingImages.length + newImages.filter(Boolean).length;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (sizes.length === 0) {
      toast.error('Select at least one size');
      return;
    }
    if (totalImageCount === 0) {
      toast.error('At least one product image is required');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      newImages.forEach((file, i) => file && formData.append(`image${i + 1}`, file));
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      if (compareAtPrice) formData.append('compareAtPrice', compareAtPrice);
      formData.append('stock', stock || '0');
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('bestseller', bestSeller);
      if (sku) formData.append('sku', sku);
      if (fabric) formData.append('fabric', fabric);
      if (fabricComposition) formData.append('fabricComposition', fabricComposition);
      if (pattern) formData.append('pattern', pattern);
      if (color) formData.append('color', color);
      if (occasion) formData.append('occasion', occasion);
      if (collectionName) formData.append('collectionName', collectionName);
      if (gsm) formData.append('gsm', gsm);
      if (dimensions) formData.append('dimensions', dimensions);
      if (careInstructions) formData.append('careInstructions', careInstructions);
      // Always sent (even as "null") so clearing the chart back out is
      // possible — the other optional fields above are append-if-truthy,
      // which means "leave unchanged", not "clear"; sizeChart needs a real
      // clear path since it's edited as structured data, not a text input.
      formData.append('sizeChart', JSON.stringify(sizeChart));

      const response = await api.patch(`/api/products/${id}`, formData);
      if (response.data.success) {
        toast.success('Product updated successfully');
        navigate('/list');
      }
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to update product'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250';

  if (loading) {
    return <p className='py-16 text-center text-gray-400'>Loading product…</p>;
  }

  return (
    <form onSubmit={submitHandler} className='flex flex-col w-full items-start gap-3'>
      <div className='w-full flex items-center justify-between'>
        <p className='text-lg font-medium'>Edit Product</p>
        <button type='button' onClick={() => navigate('/list')} className='text-sm text-gray-500 hover:text-ink'>
          ← Back to list
        </button>
      </div>

      <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
        <p className='mb-2'>Images</p>
        <div className='flex gap-2 flex-wrap'>
          {existingImages.map((url) => (
            <div key={url} className='relative'>
              <img src={url} className='w-20 h-20 object-cover rounded-xl border border-gray-200' alt='' />
              <button
                type='button'
                onClick={() => removeExistingImage(url)}
                className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white shadow-soft border border-gray-200 text-gray-500 hover:text-red-500 text-xs flex items-center justify-center'
                aria-label='Remove image'
              >
                ×
              </button>
            </div>
          ))}
          {newImages.map((file, i) => (
            <label key={i} htmlFor={`newImage${i}`}>
              <img
                className='w-20 h-20 object-cover rounded-xl border border-dashed border-gray-300'
                src={file ? URL.createObjectURL(file) : assets.upload_area}
                alt='Upload area'
              />
              <input
                id={`newImage${i}`}
                type='file'
                hidden
                onChange={(e) => handleNewImageChange(i, e.target.files[0])}
              />
            </label>
          ))}
        </div>
        <p className='text-xs text-gray-400 mt-2'>Click × to remove an existing image. Up to 4 images total.</p>

        <div className='w-full mt-5'>
          <p className='mb-2'>Product Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} type='text' required className={`max-w-[500px] ${inputClass}`} />
        </div>

        <div className='w-full'>
          <p className='mb-2 mt-4'>Product Description</p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} required className={`max-w-[500px] ${inputClass}`} />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-4'>
          <div>
            <p className='mb-2'>Product Category</p>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <p className='mb-2'>Sub Category</p>
            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className={inputClass}>
              {SUBCATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <p className='mb-2'>Product Price</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className={`sm:w-[120px] ${inputClass}`} type='number' required min='0' step='0.01' />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-4'>
          <div>
            <p className='mb-2'>Compare-at Price <span className='text-gray-400 font-normal'>(optional)</span></p>
            <input onChange={(e) => setCompareAtPrice(e.target.value)} value={compareAtPrice} className={`sm:w-[160px] ${inputClass}`} type='number' min='0' step='0.01' />
          </div>
          <div>
            <p className='mb-2'>Stock Quantity</p>
            <input onChange={(e) => setStock(e.target.value)} value={stock} className={`sm:w-[120px] ${inputClass}`} type='number' min='0' />
          </div>
        </div>
      </div>

      <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
        <p className='font-medium mb-3'>Textile Details</p>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>SKU</p>
            <input onChange={(e) => setSku(e.target.value)} value={sku} className={`sm:w-[160px] ${inputClass}`} type='text' />
          </div>
          <div>
            <p className='mb-2'>Fabric</p>
            <input onChange={(e) => setFabric(e.target.value)} value={fabric} className={`sm:w-[160px] ${inputClass}`} type='text' />
          </div>
          <div>
            <p className='mb-2'>Fabric Composition</p>
            <input onChange={(e) => setFabricComposition(e.target.value)} value={fabricComposition} className={`sm:w-[220px] ${inputClass}`} type='text' />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-4'>
          <div>
            <p className='mb-2'>Pattern</p>
            <input onChange={(e) => setPattern(e.target.value)} value={pattern} className={`sm:w-[140px] ${inputClass}`} type='text' />
          </div>
          <div>
            <p className='mb-2'>Color</p>
            <input onChange={(e) => setColor(e.target.value)} value={color} className={`sm:w-[140px] ${inputClass}`} type='text' />
          </div>
          <div>
            <p className='mb-2'>Occasion</p>
            <input onChange={(e) => setOccasion(e.target.value)} value={occasion} className={`sm:w-[140px] ${inputClass}`} type='text' />
          </div>
          <div>
            <p className='mb-2'>Collection</p>
            <input onChange={(e) => setCollectionName(e.target.value)} value={collectionName} className={`sm:w-[160px] ${inputClass}`} type='text' />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-4'>
          <div>
            <p className='mb-2'>GSM (fabric weight)</p>
            <input onChange={(e) => setGsm(e.target.value)} value={gsm} className={`sm:w-[140px] ${inputClass}`} type='number' min='0' />
          </div>
          <div>
            <p className='mb-2'>Dimensions</p>
            <input onChange={(e) => setDimensions(e.target.value)} value={dimensions} className={`sm:w-[200px] ${inputClass}`} type='text' />
          </div>
        </div>
        <div className='w-full mt-4'>
          <p className='mb-2'>Care Instructions</p>
          <textarea onChange={(e) => setCareInstructions(e.target.value)} value={careInstructions} className={`max-w-[500px] ${inputClass}`} />
        </div>
      </div>

      <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3 flex-wrap'>
          {SIZE_OPTIONS.map((size) => (
            <div key={size} onClick={() => setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? 'bg-accent-100 text-accent-700 border-accent-400' : 'bg-gray-50 border-gray-200'} px-4 py-2 cursor-pointer rounded-full border transition-colors duration-250`}>{size}</p>
            </div>
          ))}
        </div>
        <div className='flex gap-2 mt-4'>
          <input id='bestseller' type='checkbox' onChange={() => setBestSeller((prev) => !prev)} checked={bestSeller} />
          <label className='cursor-pointer' htmlFor='bestseller'>Add to bestseller</label>
        </div>
      </div>

      <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
        <p className='font-medium mb-1'>Size Chart <span className='text-gray-400 font-normal'>(optional, shown to customers on the product page)</span></p>
        <div className='mt-3'>
          <SizeChartEditor value={sizeChart} onChange={setSizeChart} />
        </div>
      </div>

      <button type='submit' disabled={submitting} className='px-8 py-3 mt-2 bg-ink hover:bg-accent-600 hover:shadow-soft transition-all duration-250 text-white rounded-full disabled:opacity-60'>
        {submitting ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
};

export default Edit;

import { useState } from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { api } from '../lib/apiClient'
import { handleAxiosError } from '../utils/handleAxiosError'
import SizeChartEditor from '../components/SizeChartEditor'

const Add = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [compareAtPrice, setCompareAtPrice] = useState("")
  const [stock, setStock] = useState("50")
  const [categrory, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [sizes, setSize] = useState([])
  const [bestSeller, setBestSeller] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sku, setSku] = useState("")
  const [fabric, setFabric] = useState("")
  const [fabricComposition, setFabricComposition] = useState("")
  const [pattern, setPattern] = useState("")
  const [color, setColor] = useState("")
  const [occasion, setOccasion] = useState("")
  const [collectionName, setCollectionName] = useState("")
  const [gsm, setGsm] = useState("")
  const [dimensions, setDimensions] = useState("")
  const [careInstructions, setCareInstructions] = useState("")
  const [sizeChart, setSizeChart] = useState(null)

  const submitHandler = async (e) => {
    e.preventDefault();
    if (sizes.length === 0) {
      toast.error("Select at least one size");
      return;
    }
    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("Upload at least one image");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      if (compareAtPrice) formData.append('compareAtPrice', compareAtPrice);
      formData.append('stock', stock || '0');
      formData.append('category', categrory);
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
      if (sizeChart) formData.append('sizeChart', JSON.stringify(sizeChart));

      const response = await api.post('/api/products/add', formData)
      if (response.data.success) {
        toast.success('Product Added Successfully')
        setName('')
        setDescription('')
        setPrice('')
        setCompareAtPrice('')
        setStock('50')
        setCategory('Men')
        setSubCategory('Topwear')
        setSize([])
        setBestSeller(false)
        setImage1(null)
        setImage2(null)
        setImage3(null)
        setImage4(null)
        setSku('')
        setFabric('')
        setFabricComposition('')
        setPattern('')
        setColor('')
        setOccasion('')
        setCollectionName('')
        setGsm('')
        setDimensions('')
        setCareInstructions('')
        setSizeChart(null)
      }
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to add product"))
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250';

  return (
    (<form onSubmit={submitHandler} className='flex flex-col w-full items-start gap-3'>
      <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
        <p className='mb-2'>Upload</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20 h-20 object-cover rounded-xl border border-gray-200' src={image1 ? URL.createObjectURL(image1) : assets.upload_area} alt="Upload Area" />
            <input onChange={(e) => handleFileChange(e, setImage1)} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20 h-20 object-cover rounded-xl border border-gray-200' src={image2 ? URL.createObjectURL(image2) : assets.upload_area} alt="Upload Area" />
            <input onChange={(e) => handleFileChange(e, setImage2)} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20 h-20 object-cover rounded-xl border border-gray-200' src={image3 ? URL.createObjectURL(image3) : assets.upload_area} alt="Upload Area" />
            <input onChange={(e) => handleFileChange(e, setImage3)} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20 h-20 object-cover rounded-xl border border-gray-200' src={image4 ? URL.createObjectURL(image4) : assets.upload_area} alt="Upload Area" />
            <input onChange={(e) => handleFileChange(e, setImage4)} type="file" id="image4" hidden />
          </label>
        </div>

        <div className='w-full'>
          <p className='mb-2 mt-4'>Product Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Enter product name' required className={`max-w-[500px] ${inputClass}`} />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product Description</p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} placeholder='Write content here' required className={`max-w-[500px] ${inputClass}`} />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>Product Category</p>
            <select value={categrory} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Sub Category</p>
            <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className={inputClass}>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
              <option value="Footwear">Footwear</option>
              <option value="Bags">Bags</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Product Price</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className={`sm:w-[120px] ${inputClass}`} type="number" placeholder='25' required min="0" step="0.01" />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-4'>
          <div>
            <p className='mb-2'>Compare-at Price <span className='text-gray-400 font-normal'>(optional — shows as a sale)</span></p>
            <input onChange={(e) => setCompareAtPrice(e.target.value)} value={compareAtPrice} className={`sm:w-[160px] ${inputClass}`} type="number" placeholder='e.g. 1299' min="0" step="0.01" />
          </div>
          <div>
            <p className='mb-2'>Stock Quantity</p>
            <input onChange={(e) => setStock(e.target.value)} value={stock} className={`sm:w-[120px] ${inputClass}`} type="number" placeholder='50' min="0" />
          </div>
        </div>
      </div>

      <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
        <p className='font-medium mb-1'>Textile Details <span className='text-gray-400 font-normal'>(optional, shown on the product page)</span></p>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-3'>
          <div>
            <p className='mb-2'>SKU</p>
            <input onChange={(e) => setSku(e.target.value)} value={sku} className={`sm:w-[160px] ${inputClass}`} type="text" placeholder='WFW-MEN-TOP-004' />
          </div>
          <div>
            <p className='mb-2'>Fabric</p>
            <input onChange={(e) => setFabric(e.target.value)} value={fabric} className={`sm:w-[160px] ${inputClass}`} type="text" placeholder='Cotton' />
          </div>
          <div>
            <p className='mb-2'>Fabric Composition</p>
            <input onChange={(e) => setFabricComposition(e.target.value)} value={fabricComposition} className={`sm:w-[220px] ${inputClass}`} type="text" placeholder='100% Combed Cotton' />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-4'>
          <div>
            <p className='mb-2'>Pattern</p>
            <input onChange={(e) => setPattern(e.target.value)} value={pattern} className={`sm:w-[140px] ${inputClass}`} type="text" placeholder='Solid' />
          </div>
          <div>
            <p className='mb-2'>Color</p>
            <input onChange={(e) => setColor(e.target.value)} value={color} className={`sm:w-[140px] ${inputClass}`} type="text" placeholder='Navy Blue' />
          </div>
          <div>
            <p className='mb-2'>Occasion</p>
            <input onChange={(e) => setOccasion(e.target.value)} value={occasion} className={`sm:w-[140px] ${inputClass}`} type="text" placeholder='Casual' />
          </div>
          <div>
            <p className='mb-2'>Collection</p>
            <input onChange={(e) => setCollectionName(e.target.value)} value={collectionName} className={`sm:w-[160px] ${inputClass}`} type="text" placeholder='New Arrivals' />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-4'>
          <div>
            <p className='mb-2'>GSM (fabric weight)</p>
            <input onChange={(e) => setGsm(e.target.value)} value={gsm} className={`sm:w-[140px] ${inputClass}`} type="number" placeholder='180' min="0" />
          </div>
          <div>
            <p className='mb-2'>Dimensions</p>
            <input onChange={(e) => setDimensions(e.target.value)} value={dimensions} className={`sm:w-[200px] ${inputClass}`} type="text" placeholder='40cm x 35cm x 12cm' />
          </div>
        </div>
        <div className='w-full mt-4'>
          <p className='mb-2'>Care Instructions</p>
          <textarea onChange={(e) => setCareInstructions(e.target.value)} value={careInstructions} placeholder='Machine wash cold. Do not bleach. Tumble dry low.' className={`max-w-[500px] ${inputClass}`} />
        </div>
      </div>

      <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3 flex-wrap'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} onClick={() => setSize(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? "bg-accent-100 text-accent-700 border-accent-400" : "bg-gray-50 border-gray-200"} px-4 py-2 cursor-pointer rounded-full border transition-colors duration-250`}>{size}</p>
            </div>
          ))}
        </div>
        <div className='flex gap-2 mt-4'>
          <input id='bestseller' type="checkbox" onChange={() => setBestSeller(prev => !prev)} checked={bestSeller} />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>
      </div>

      <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
        <p className='font-medium mb-1'>Size Chart <span className='text-gray-400 font-normal'>(optional, shown to customers on the product page)</span></p>
        <div className='mt-3'>
          <SizeChartEditor value={sizeChart} onChange={setSizeChart} />
        </div>
      </div>

      <button type='submit' disabled={submitting} className='px-8 py-3 mt-2 bg-ink hover:bg-accent-600 hover:shadow-soft transition-all duration-250 text-white rounded-full disabled:opacity-60'>
        {submitting ? 'Adding…' : 'Add Product'}
      </button>
    </form>)
  );
}

export default Add;

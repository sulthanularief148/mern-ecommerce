import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { backendurl } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios'

const Add = ({ token }) => {
  // Initialize state variables for storing uploaded images
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categrory, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [sizes, setSize] = useState([])
  const [bestSeller, setBestSeller] = useState(false)


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', categrory);
      formData.append('subCategory', subCategory);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('bestseller', bestSeller);
      const response = await axios.post(backendurl + '/api/product/add', formData, { headers: { token } })
      if (response.data.success) {
        toast.success('Product Added Successfully')
        setName('')
        setDescription('')
        setPrice('')
        setSize([])
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error)
      console.log(error);

    }
  }

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  return (
    (<form onSubmit={submitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload</p>
        <div className='flex gap-2'>
          {/* Image 1 Upload */}
          <label htmlFor="image1">
            <img
              className='w-20'
              src={image1 ? URL.createObjectURL(image1) : assets.upload_area}
              alt="Upload Area"
            />
            <input
              onChange={(e) => handleFileChange(e, setImage1)}
              type="file"
              id="image1"
              hidden
            />
          </label>

          {/* Image 2 Upload */}
          <label htmlFor="image2">
            <img
              className='w-20'
              src={image2 ? URL.createObjectURL(image2) : assets.upload_area}
              alt="Upload Area"
            />
            <input
              onChange={(e) => handleFileChange(e, setImage2)}
              type="file"
              id="image2"
              hidden
            />
          </label>

          {/* Image 3 Upload */}
          <label htmlFor="image3">
            <img
              className='w-20'
              src={image3 ? URL.createObjectURL(image3) : assets.upload_area}
              alt="Upload Area"
            />
            <input
              onChange={(e) => handleFileChange(e, setImage3)}
              type="file"
              id="image3"
              hidden
            />
          </label>

          {/* Image 4 Upload */}
          <label htmlFor="image4">
            <img
              className='w-20'
              src={image4 ? URL.createObjectURL(image4) : assets.upload_area}
              alt="Upload Area"
            />
            <input
              onChange={(e) => handleFileChange(e, setImage4)}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>

        {/* Product Name Input */}
        <div className='w-full'>
          <p className='mb-2'>Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder='Enter product name'
            required
            className='w-full max-w-[500px] px-3 py-2'
          />
        </div>

        {/* Product Description Input */}
        <div className='w-full'>
          <p className='mb-2'>Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder='Write content here'
            required
            className='w-full max-w-[500px] px-3 py-2'
          />
        </div>

        {/* Product Category and Sub-Category */}
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>Product Category</p>
            <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Sub Category</p>
            <select onChange={e => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className='w-full px-3 py-2 sm:w-[120px]'
              type="number"
              placeholder='25'
              required
            />
          </div>
        </div>
      </div>
      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} onClick={() => setSize(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200 "} px-3 py-2 cursor-pointer`}>{size}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='flex gap-2 mt-2'>
        <input id='bestseller' type="checkbox" onChange={() => setBestSeller(prev => !prev)} checked={bestSeller} />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>
      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>)
  );
}

export default Add;

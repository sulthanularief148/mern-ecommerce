import React, { useState, useEffect } from 'react'
import { backendurl } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'

const List = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await fetch(`${backendurl}/api/product/list`)
      const data = await response.json()
      setList(data.products)
      console.log(list);

    } catch (error) {
      toast.error(response.data.message)
      console.log(error)
    }
  }
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendurl}/api/product/remove`, { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchList()

  }, [])
  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>
        {list.length > 0 ? (list.map((product) => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={product._id}>
            {product.images && <img className='w-12' a src={product.images[0]} alt="" />}
            <p>{product.name}</p>
            <p>{product.category}</p>
            <p>{`₹`}{product.price}</p>
            <p onClick={() => removeProduct(product._id)} className='text-right md:text-center cursor-pointer text-lg'>{`X`}</p>
          </div>
        ))) : <p>No Products Found</p>}
      </div>
    </>
  )
}

// export default List

// import React, { useState, useEffect } from 'react';
// import { backendurl } from '../App';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const List = ({ token }) => {
//   const [list, setList] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 10; // Number of products per page

//   const fetchList = async (page) => {
//     try {
//       const response = await axios.get(`${backendurl}/api/product/list`, {
//         params: { page, limit },
//       });
//       const data = response.data;
//       setList(data.products);
//       setTotalPages(data.totalPages);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Error fetching products');
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchList(currentPage);
//   }, [currentPage]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <>
//       <p className='mb-2'>All Products List</p>
//       <div className='flex flex-col gap-2'>
//         <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b className='text-center'>Action</b>
//         </div>
//         {list.length > 0 ? (
//           list.map((product) => (
//             <div
//               className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'
//               key={product._id}
//             >
//               {product.images && <img className='w-12' src={product.images[0]} alt="" />}
//               <p>{product.name}</p>
//               <p>{product.category}</p>
//               <p>{`₹${product.price}`}</p>
//               <p
//                 onClick={() => removeProduct(product._id)}
//                 className='text-right md:text-center cursor-pointer text-lg'
//               >
//                 X
//               </p>
//             </div>
//           ))
//         ) : (
//           <p>No Products Found</p>
//         )}
//       </div>
//       {/* Pagination Controls */}
//       <div className='flex justify-center mt-4'>
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index + 1}
//             onClick={() => handlePageChange(index + 1)}
//             className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

export default List;

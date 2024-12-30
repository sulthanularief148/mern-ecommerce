import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductsItem = ({ id, name, price, image }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link to={`/product/${id}`} className='text-gray-700 cursor-pointer'>
            <div className='overflow-hidden'>
                {image && <img src={image[0]} alt={name} className='hover:scale-110 transition ease-in-out object-cover' />}
            </div>
            <p className='pt-3 pb-1 text-sm'>{currency}{price} </p>
            <p className='text-sm font-medium'>{name} </p>
        </Link>
    )
}

export default ProductsItem
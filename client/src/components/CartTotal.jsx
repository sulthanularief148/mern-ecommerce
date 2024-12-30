import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Title } from './Title'

const CartTotal = () => {
    const { getCartAmount, currency, delivery_fee } = useContext(ShopContext)
    return (
        (<div className='w-full'>
            <div className='text-2xl'>
                <Title text1={`CART`} text2={`TOTALS`} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p> SubTotal</p>
                    <p>{currency}{getCartAmount()}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency}{delivery_fee}.00</p>
                    <hr />
                </div>
                <div className='flex justify-between'>
                    <strong>Total</strong>
                    <strong>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}</strong>
                </div>
            </div>
        </div>)
    );
}

export default CartTotal
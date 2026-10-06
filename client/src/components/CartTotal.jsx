import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Title } from './Title'
import { estimateTotals, FREE_SHIPPING_THRESHOLD } from '../constant/checkout'

const CartTotal = () => {
    const {
        getCartAmount, currency, appliedCoupon, couponLoading, applyCoupon, removeCoupon, deliveryMethod, storeSettings,
    } = useContext(ShopContext)
    const [couponInput, setCouponInput] = useState('')
    const subtotal = getCartAmount();

    const totals = estimateTotals({
        subtotal,
        discountAmount: appliedCoupon?.discountAmount || 0,
        deliveryMethod,
        storeSettings,
    });

    const handleApply = async (e) => {
        e.preventDefault();
        if (!couponInput.trim()) return;
        try {
            await applyCoupon(couponInput.trim());
            setCouponInput('');
        } catch {
            // toast already shown by context
        }
    };

    return (
        <div className='w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-6'>
            <div className='text-2xl'>
                <Title text1={`CART`} text2={`TOTALS`} />
            </div>

            {!appliedCoupon ? (
                <form onSubmit={handleApply} className='flex gap-2 mt-4'>
                    <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        type="text"
                        placeholder="Coupon code"
                        className='flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-accent-500 focus:bg-white transition-colors duration-250'
                    />
                    <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        className='px-4 py-2 text-sm border border-ink rounded-full hover:bg-ink hover:text-white transition-colors duration-250 disabled:opacity-40'
                    >
                        {couponLoading ? '...' : 'Apply'}
                    </button>
                </form>
            ) : (
                <div className='flex items-center justify-between mt-4 bg-accent-50 border border-accent-200 rounded-xl px-3 py-2 text-sm'>
                    <span className='text-accent-700'>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                    <button type="button" onClick={removeCoupon} className='text-gray-500 hover:text-red-500 text-xs underline'>Remove</button>
                </div>
            )}

            <div className='flex flex-col gap-2 mt-4 text-sm'>
                <div className='flex justify-between'>
                    <p>SubTotal</p>
                    <p>{currency}{totals.subtotal.toFixed(2)}</p>
                </div>
                {totals.discountAmount > 0 && (
                    <div className='flex justify-between text-accent-600'>
                        <p>Discount</p>
                        <p>-{currency}{totals.discountAmount.toFixed(2)}</p>
                    </div>
                )}
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{totals.shippingFee === 0 ? 'FREE' : `${currency}${totals.shippingFee.toFixed(2)}`}</p>
                </div>
                {totals.shippingFee > 0 && (
                    <p className='text-xs text-gray-400 -mt-1'>
                        Free standard shipping on orders over {currency}{storeSettings?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD}
                    </p>
                )}
                <div className='flex justify-between'>
                    <p>Tax ({Math.round(totals.taxRate * 1000) / 10}%)</p>
                    <p>{currency}{totals.taxAmount.toFixed(2)}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <strong>Total</strong>
                    <strong>{currency}{totals.total.toFixed(2)}</strong>
                </div>
            </div>
        </div>
    );
}

export default CartTotal

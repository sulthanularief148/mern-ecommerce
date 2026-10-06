import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { SectionWrapper } from "../hoc"
import { ShopContext } from "../context/ShopContext"
import { OrderTracker, Title } from "../components"
import { estimatedDeliveryDate } from "../constant/checkout"
import { handleAxiosError } from "../../utils/handleAxiosError"
import * as orderApi from "../services/orderApi"
import { toast } from "react-toastify"

const OrderSuccess = () => {
  const { id } = useParams();
  const { currency, authReady, user, navigate } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authReady) return;
    if (!user) { navigate('/login'); return; }
    (async () => {
      try {
        const data = await orderApi.fetchMyOrder(id);
        setOrder(data);
      } catch (error) {
        toast.error(handleAxiosError(error, "Order not found"));
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    })();
  }, [authReady, user, id]);

  if (loading || !order) {
    return <div className="border-t pt-16 pb-20 text-center text-gray-400">Loading your order…</div>;
  }

  return (
    <div className="border-t pt-16 pb-20 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-accent-50 border border-accent-200 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-2xl">
          <Title text1="ORDER" text2="CONFIRMED" />
        </div>
        <p className="text-gray-500 text-sm mt-2">Thank you — your order has been placed successfully.</p>
      </div>

      <div className="border border-gray-100 rounded-2xl shadow-soft p-6 mb-6 bg-white">
        <div className="flex flex-wrap justify-between gap-3 text-sm mb-5">
          <div>
            <p className="text-gray-400">Order Number</p>
            <p className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-gray-400">Payment Status</p>
            <p className="font-medium">
              {order.paymentMethod === 'COD' ? 'Pay on Delivery' : (order.payment ? 'Paid' : 'Pending')}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Estimated Delivery</p>
            <p className="font-medium">{estimatedDeliveryDate(order.deliveryMethod)}</p>
          </div>
        </div>

        <OrderTracker status={order.status} />

        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <img
                  src={item.product?.images?.[0] || "/placeholder-product.svg"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-xl border border-gray-200 bg-gray-50 shrink-0"
                />
                <p>{item.name} <span className="text-gray-400">× {item.quantity}</span> <span className="text-gray-400">(Size: {item.size})</span></p>
              </div>
              <p>{currency}{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-1.5 text-sm max-w-xs ml-auto">
          <div className="flex justify-between"><p>Subtotal</p><p>{currency}{Number(order.subtotal).toFixed(2)}</p></div>
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-accent-600">
              <p>Discount {order.couponCode ? `(${order.couponCode})` : ''}</p>
              <p>-{currency}{Number(order.discountAmount).toFixed(2)}</p>
            </div>
          )}
          <div className="flex justify-between"><p>Shipping</p><p>{Number(order.shippingFee) === 0 ? 'FREE' : `${currency}${Number(order.shippingFee).toFixed(2)}`}</p></div>
          <div className="flex justify-between"><p>Tax</p><p>{currency}{Number(order.taxAmount).toFixed(2)}</p></div>
          <div className="flex justify-between font-semibold text-base pt-1"><p>Total</p><p>{currency}{Number(order.amount).toFixed(2)}</p></div>
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl shadow-soft p-6 mb-8 text-sm bg-white">
        <p className="font-medium mb-2">Delivery Address</p>
        <p className="text-gray-500">{order.address.firstName} {order.address.lastName}</p>
        <p className="text-gray-500">{order.address.street}</p>
        <p className="text-gray-500">{order.address.city}, {order.address.state}, {order.address.country} {order.address.zipcode}</p>
        <p className="text-gray-500">{order.address.phone}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders" className="text-center px-8 py-3 text-sm border border-ink rounded-full hover:bg-ink hover:text-white transition-colors duration-250">
          Track Order
        </Link>
        <Link to="/shop" className="text-center px-8 py-3 text-sm bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default SectionWrapper(OrderSuccess, "order-success");

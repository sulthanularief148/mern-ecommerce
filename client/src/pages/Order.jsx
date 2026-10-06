import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SectionWrapper } from "../hoc"
import { ShopContext } from "../context/ShopContext"
import { Title, OrderTracker } from "../components"
import { handleAxiosError } from "../../utils/handleAxiosError"
import * as orderApi from "../services/orderApi"
import * as returnApi from "../services/returnApi"
import { toast } from "react-toastify"

const STATUS_LABELS = {
  ORDER_PLACED: "Order Placed",
  PACKING: "Packing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const RETURN_STATUS_LABELS = {
  REQUESTED: "Return Requested",
  APPROVED: "Return Approved",
  REJECTED: "Return Rejected",
  COMPLETED: "Return Completed",
};

const Order = () => {
  const { user, authReady, currency } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [returnsByOrder, setReturnsByOrder] = useState({})
  const [returnDrafts, setReturnDrafts] = useState({})
  const [submittingReturn, setSubmittingReturn] = useState(null)

  const loadOrders = async () => {
    if (!user) return
    setLoading(true)
    try {
      const [data, returns] = await Promise.all([orderApi.fetchMyOrders(), returnApi.fetchMyReturns()])
      setOrders(data)
      setReturnsByOrder(Object.fromEntries(returns.map((r) => [r.orderId, r])))
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to load orders"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authReady) loadOrders()
  }, [authReady, user])

  const submitReturn = async (orderId) => {
    const reason = (returnDrafts[orderId] || '').trim()
    if (reason.length < 10) {
      toast.error('Please describe the reason in a bit more detail (10+ characters)')
      return
    }
    setSubmittingReturn(orderId)
    try {
      const returnRequest = await returnApi.createReturn(orderId, reason)
      setReturnsByOrder((prev) => ({ ...prev, [orderId]: returnRequest }))
      toast.success('Return request submitted')
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to submit return request'))
    } finally {
      setSubmittingReturn(null)
    }
  }

  if (!authReady || loading) {
    return <div className="border-t pt-16 pb-20 text-center text-gray-400">Loading orders…</div>
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={`MY`} text2={`ORDERS`} />
      </div>
      <div>
        {orders.length === 0 && (
          <p className="py-12 text-center text-gray-400">You haven't placed any orders yet.</p>
        )}
        {orders.map((order) => (
          <div key={order.id} className="py-6 border-t border-b text-gray-700">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toDateString()} · {order.paymentMethod}
                {order.payment ? " · Paid" : ""} ·{" "}
                <Link to={`/order/success/${order.id}`} className="hover:text-accent-600 underline underline-offset-2">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </Link>
              </p>
              <p className="text-sm font-medium text-ink">{STATUS_LABELS[order.status] || order.status}</p>
            </div>

            <div className="max-w-lg mx-auto mb-5">
              <OrderTracker status={order.status} />
            </div>

            <div className="flex items-center justify-between mb-5 text-xs">
              {order.trackingNumber ? (
                <p className="text-gray-500">
                  Tracking: <span className="text-ink font-medium">{order.carrier ? `${order.carrier} — ` : ''}{order.trackingNumber}</span>
                </p>
              ) : <span />}
              <button
                type="button"
                onClick={() => orderApi.downloadInvoice(order.id).catch((e) => toast.error(handleAxiosError(e, 'Failed to download invoice')))}
                className="text-accent-600 hover:underline underline-offset-2"
              >
                Download Invoice
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0] || "/placeholder-product.svg"}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-gray-200 bg-gray-50 shrink-0"
                    />
                    <p>{item.name} <span className="text-gray-400">× {item.quantity}</span> <span className="text-gray-400">(Size: {item.size})</span></p>
                  </div>
                  <p>{currency}{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <p className="text-right text-sm font-semibold mt-2">Total: {currency}{order.amount}</p>

            {order.status === "DELIVERED" && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                {returnsByOrder[order.id] ? (
                  <p className="text-gray-500">
                    {RETURN_STATUS_LABELS[returnsByOrder[order.id].status] || returnsByOrder[order.id].status}
                    {returnsByOrder[order.id].adminNote && (
                      <span className="block text-xs text-gray-400 mt-1">Note: {returnsByOrder[order.id].adminNote}</span>
                    )}
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={returnDrafts[order.id] || ''}
                      onChange={(e) => setReturnDrafts((prev) => ({ ...prev, [order.id]: e.target.value }))}
                      placeholder="Reason for return"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-xs outline-none focus:border-accent-500"
                    />
                    <button
                      type="button"
                      onClick={() => submitReturn(order.id)}
                      disabled={submittingReturn === order.id}
                      className="text-xs px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-250 disabled:opacity-60 shrink-0"
                    >
                      {submittingReturn === order.id ? 'Submitting…' : 'Request Return'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionWrapper(Order, "order")

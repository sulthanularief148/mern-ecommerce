import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../config';
import { assets } from '../assets/assets';
import { api } from '../lib/apiClient';
import { downloadBlob } from '../lib/downloadBlob';
import { handleAxiosError } from '../utils/handleAxiosError';
import OrderTracker from '../components/OrderTracker';

const STATUS_OPTIONS = [
  { value: 'ORDER_PLACED', label: 'Order Placed' },
  { value: 'PACKING', label: 'Packing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out For Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [savingTracking, setSavingTracking] = useState(null);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/orders/admin/list');
      setOrders(response.data.data.orders || []);
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to load orders"));
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatus = async (event, orderId) => {
    try {
      const response = await api.post('/api/orders/admin/status', { orderId, status: event.target.value });
      if (response.data.success) {
        fetchAllOrders();
        toast.success('Order status updated successfully!');
      }
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to update order status"));
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const trackingDraftFor = (order) => trackingDrafts[order.id] ?? {
    trackingNumber: order.trackingNumber || '',
    carrier: order.carrier || '',
  };

  const setTrackingField = (orderId, field, value) => {
    setTrackingDrafts((prev) => ({
      ...prev,
      [orderId]: { ...trackingDraftFor({ id: orderId, ...prev[orderId] }), [field]: value },
    }));
  };

  const saveTracking = async (order) => {
    const draft = trackingDraftFor(order);
    setSavingTracking(order.id);
    try {
      await api.post('/api/orders/admin/tracking', {
        orderId: order.id,
        trackingNumber: draft.trackingNumber,
        carrier: draft.carrier,
      });
      toast.success('Tracking info saved');
      fetchAllOrders();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to save tracking info'));
    } finally {
      setSavingTracking(null);
    }
  };

  const downloadInvoice = async (order) => {
    try {
      const response = await api.get(`/api/orders/admin/${order.id}/invoice`, { responseType: 'blob' });
      downloadBlob(response.data, `invoice-${order.id.slice(0, 8)}.pdf`);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to download invoice'));
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-400">Loading orders…</div>;
  }

  if (!orders.length) {
    return <div className="py-16 text-center text-gray-400">No orders yet.</div>;
  }

  return (
    <div className="order-container">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-100 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 rounded-2xl shadow-soft bg-white"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[0.5r_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start">
            <div className="flex flex-wrap gap-1 w-16">
              {order.items.slice(0, 4).map((item) => (
                <img
                  key={item.id}
                  src={item.product?.images?.[0] || assets.parcel_icon}
                  alt={item.name}
                  className="w-7 h-7 object-cover rounded border border-gray-200"
                />
              ))}
            </div>
            <div>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <p key={item.id} className="py-[0.5]">
                    {item.name} × {item.quantity} <span>(Size: {item.size})</span>
                    {idx < order.items.length - 1 && ','}
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">{`${order.address.firstName} ${order.address.lastName}`}</p>
              <div className="order-address">
                <p>{`${order.address.street},`}</p>
                <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Payment Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.createdAt).toDateString()}</p>
            </div>
            <div className="text-sm sm:text-[15px]">
              <p className="font-semibold">{currency}{order.amount}</p>
              {order.couponCode && (
                <p className="text-xs text-accent-600 mt-1">
                  {order.couponCode} (-{currency}{order.discountAmount})
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">{order.deliveryMethod === 'EXPRESS' ? 'Express' : 'Standard'} delivery</p>
            </div>
            <select
              onChange={(event) => handleOrderStatus(event, order.id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="max-w-md mt-5 pt-4 border-t border-gray-100">
            <OrderTracker status={order.status} />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Carrier</label>
              <input
                type="text"
                value={trackingDraftFor(order).carrier}
                onChange={(e) => setTrackingField(order.id, 'carrier', e.target.value)}
                placeholder="e.g. Delhivery"
                className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-xs w-32"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Tracking Number</label>
              <input
                type="text"
                value={trackingDraftFor(order).trackingNumber}
                onChange={(e) => setTrackingField(order.id, 'trackingNumber', e.target.value)}
                placeholder="Tracking number"
                className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-xs w-40"
              />
            </div>
            <button
              type="button"
              onClick={() => saveTracking(order)}
              disabled={savingTracking === order.id}
              className="text-xs px-4 py-2 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60"
            >
              {savingTracking === order.id ? 'Saving…' : 'Save Tracking'}
            </button>
            <button
              type="button"
              onClick={() => downloadInvoice(order)}
              className="text-xs px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-250"
            >
              Download Invoice
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendurl, currency } from '../App';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      console.log("No token provided.");
      return null;
    }
    console.log("Using token:", token);

    try {
      const response = await axios.post(
        `${backendurl}/api/order/list`,
        {},
        { headers: { token } } 
      );
      console.log("Using token:", token);


      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
        console.log("Error occuring in listing the ordered product");
      }
    } catch (error) {
      console.error(error + "Error occuring in listing the ordered product");
      toast.error(error.message, "Error occuring in listing the ordered product");
    }
  };

  const handleOrderStatus = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendurl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        fetchAllOrders();
        toast.success('Order status updated successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (!orders.length) {
    return <div>No Order Details Found</div>;
  }

  return (
    <div className="order-container">
      {orders.map((order, index) => (
        <div
          key={order._id}
          className="grid grid-cols-1 sm:grid-cols-[0.5r_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
        >
          <img src={assets.parcel_icon} alt="Parcel Icon" className="parcel-icon" />
          <div>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <p key={idx} className="py-[0.5]">
                  X {item.name} {item.quantity} <span>{item.size}</span>
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
            <p>Date: {new Date(order.date).toDateString()}</p>
          </div>
          <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
          <select
            onChange={(event) => handleOrderStatus(event, order._id)}
            value={order.status}
            className="p-2 font-semibold"
          >
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default Orders;

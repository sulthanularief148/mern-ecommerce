import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
    const { token, navigate, backendurl, setCartItems } = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    const success = searchParams.get("success") === "true"; // Convert to boolean
    const orderId = searchParams.get("orderId");

    const verifyPayment = async () => {
        if (!token) {
            toast.error("Unauthorized. Please login.");
            return navigate('/login');
        }

        try {
            const response = await axios.post(
                `${backendurl}/api/order/verifyStripe`,
                { orderId, success },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setCartItems({});
                toast.success(response.data.message);
                navigate('/orders');
            } else {
                toast.error(response.data.message);
                navigate('/cart');
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please try again.");
            navigate('/cart');
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return <div>Verifying your payment...</div>;
};

export default Verify;

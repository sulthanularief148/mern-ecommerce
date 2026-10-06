import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { handleAxiosError } from '../../utils/handleAxiosError';
import * as orderApi from '../services/orderApi';
import { toast } from 'react-toastify';

const Verify = () => {
    const { user, authReady, navigate, loadCart } = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("orderId");

    useEffect(() => {
        if (!authReady) return;

        if (!user) {
            toast.error("Unauthorized. Please login.");
            navigate('/login');
            return;
        }

        (async () => {
            try {
                const result = await orderApi.verifyStripe({ orderId });
                if (result.paid) {
                    await loadCart();
                    toast.success("Payment confirmed");
                    navigate(`/order/success/${orderId}`);
                } else {
                    toast.error("Payment was not completed");
                    navigate('/cart');
                }
            } catch (error) {
                toast.error(handleAxiosError(error, "Payment verification failed. Please try again."));
                navigate('/cart');
            }
        })();
    }, [authReady, user]);

    return <div className="py-20 text-center text-gray-400">Verifying your payment…</div>;
};

export default Verify;

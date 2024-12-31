import { useContext, useState } from "react"
import { assets } from "../assets"
import { CartTotal, Title } from "../components"
import { ShopContext } from "../context/ShopContext"
import axios from "axios"
import { toast } from "react-toastify"

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod')
    const { navigate, backendurl, token, setToken, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        zipcode: '',
        city: '',
        state: '',
        country: '',
    })
    const onChangeHandler = (e) => {
        const name = e.target.name
        const value = e.target.value
        setFormData((prevData) => ({ ...prevData, [name]: value }))
    }
    const initPay = (order) => {
        const option = {
            key: import.meta.env.VITE_RAZORPAY_API_KEY,
            amout: order.amount,
            currecny: order.currency,
            name: "Order Payment",
            description: "Order Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response);
                try {
                    const { data } = await axios.post(`${backendurl}/order/verifyRazorPay`, response, { headers: { token } })
                    if (data.success) {
                        navigate("/orders")
                        setCartItems({})
                    }

                } catch (error) {
                    console.log(error);
                    toast.error(error.message)

                }

            }
        }
        const rzp = new window.Razorpay(option)
        rzp.open()
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            let orderItems = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)

                        }
                    }
                }
            }
            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee,

            }
            switch (method) {
                case 'cod':
                    const response = await axios.post(
                        `${backendurl}/api/order/place`,
                        orderData,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    if (response.data.success) {
                        toast.success(response.data.message)
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;
                case 'stripe':
                    const responseStripe = await axios.post(`${backendurl}/api/order/stripe`, orderData, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data
                        window.location.replace(session_url)
                        setCartItems({})
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;

                case 'razorpay':
                    const responseRazorpay = await axios.post(`${backendurl}/api/order/razorpay`, orderData, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (responseRazorpay.data.success) {
                        // const { session_url } = responseRazorpay.data
                        // window.location.replace(session_url)
                        console.log(responseRazorpay.data, "Razor Pay");
                        initPay(responseRazorpay.data.order)

                        setCartItems({})
                    } else {
                        toast.error(responseRazorpay.data.message)
                    }
                    break;
                default:
                    orderData.paymentMethod = 'cod'

            }

        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }
    return (
        (<form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t ">
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1={`DELIVERY`} text2={`DETAILS`} />
                </div>
                <div className="flex gap-3">
                    <input required placeholder="First Name" type="text" onChange={onChangeHandler} value={formData.firstName} name={'firstName'} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                    <input required type="text" placeholder="Last Name" onChange={onChangeHandler} value={formData.lastName} name={'lastName'} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                </div>
                <input required type="email" onChange={onChangeHandler} value={formData.email} name={'email'} placeholder="Email" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                <input required type="text" onChange={onChangeHandler} value={formData.street} name={'street'} placeholder="Street" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                <div className="flex gap-3">
                    <input required type="text" onChange={onChangeHandler} value={formData.city} name={'city'} placeholder="City" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                    <input required type="text" onChange={onChangeHandler} value={formData.state} name={'state'} placeholder="State" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                </div>
                <div className="flex gap-3">
                    <input required type="number" onChange={onChangeHandler} value={formData.zipcode} name={'zipcode'} placeholder="Zip Code" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                    <input required type="text" onChange={onChangeHandler} value={formData.country} name={'country'} placeholder="Country" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                </div>
                <input required type="number" onChange={onChangeHandler} value={formData.phone} name={'phone'} placeholder="Phone" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
            </div>
            {/* Right Side */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                <div className="mt-12">
                    <Title text1={`PAYEMENT`} text2={`METHOD`} />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div onClick={() => setMethod('stripe')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer`}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full  ${method === "stripe" ? "bg-green-400" : ""}`}></p>
                            <img src={assets.stripe_logo} alt="" className="h-5 mx-4" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer `}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}></p>
                            <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
                        </div>
                        <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer `}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        <button type="submit" onClick={() => navigate("/orders")} className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>)
    );
}

export default PlaceOrder
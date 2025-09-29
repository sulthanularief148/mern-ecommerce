import { useContext, useState } from "react";
import { assets } from "../assets";
import { CartTotal, Title, InputField } from "../components";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const countryCodes = [
    { code: "+1", country: "USA" },
    { code: "+91", country: "India" },
    { code: "+44", country: "UK" },
    // Add more countries as needed
];

const PlaceOrder = () => {
    const [method, setMethod] = useState("cod");
    const { navigate, backendurl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } =
        useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "+91",
        street: "",
        zipcode: "",
        city: "",
        state: "",
        country: "",
    });

    const [validationErrors, setValidationErrors] = useState({});

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "email":
                if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format.";
                break;
            // case "phone":
            //     if (!/^\d{10}$/.test(value)) error = "Phone must be 10 digits.";
            //     break;
            case "zipcode":
                if (!/^\d{5,6}$/.test(value)) error = "Invalid Zip Code.";
                break;
            default:
                if (!value.trim()) error = "This field is required.";

        }
        return error;
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;
        Object.entries(formData).forEach(([name, value]) => {
            const error = validateField(name, value);
            if (error) isValid = false;
            errors[name] = error;
        });
        setValidationErrors(errors);
        return isValid;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill out all fields correctly.");
            return;
        }

        try {
            const orderItems = [];
            for (const itemId in cartItems) {
                for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                        const itemInfo = structuredClone(products.find((p) => p._id === itemId));
                        if (itemInfo) {
                            itemInfo.size = size;
                            itemInfo.quantity = cartItems[itemId][size];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee,
            };

            let response;
            switch (method) {
                case "cod":
                    response = await axios.post(`${backendurl}/api/order/place`, orderData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.data.success) {
                        toast.success(response.data.message);
                        setCartItems({});
                        navigate("/orders");
                    } else toast.error(response.data.message);
                    break;

                case "stripe":
                    response = await axios.post(`${backendurl}/api/order/stripe`, orderData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.data.success) window.location.replace(response.data.session_url);
                    else toast.error(response.data.message);
                    break;

                case "razorpay":
                    response = await axios.post(`${backendurl}/api/order/razorpay`, orderData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.data.success) {
                        const options = {
                            key: import.meta.env.VITE_RAZORPAY_API_KEY,
                            amount: response.data.order.amount,
                            currency: response.data.order.currency,
                            name: "Order Payment",
                            order_id: response.data.order.id,
                            handler: async (res) => {
                                try {
                                    const verify = await axios.post(`${backendurl}/order/verifyRazorPay`, res, {
                                        headers: { token },
                                    });
                                    if (verify.data.success) {
                                        navigate("/orders");
                                        setCartItems({});
                                    }
                                } catch (err) {
                                    toast.error(err.message);
                                }
                            },
                        };
                        const rzp = new window.Razorpay(options);
                        rzp.open();
                    } else toast.error(response.data.message);
                    break;

                default:
                    orderData.paymentMethod = "cod";
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
        >
            {/* Left: Delivery Details */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1="DELIVERY" text2="DETAILS" />
                </div>
                <div className="flex gap-3">
                    <InputField
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={onChangeHandler}
                        error={validationErrors.firstName}
                    />
                    <InputField
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={onChangeHandler}
                        error={validationErrors.lastName}
                    />
                </div>
                <InputField
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChangeHandler}
                    error={validationErrors.email}
                />
                <InputField
                    placeholder="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={onChangeHandler}
                    error={validationErrors.street}
                />
                <div className="flex gap-3">
                    <InputField
                        placeholder="City"
                        name="city"
                        value={formData.city}
                        onChange={onChangeHandler}
                        error={validationErrors.city}
                    />
                    <InputField
                        placeholder="State"
                        name="state"
                        value={formData.state}
                        onChange={onChangeHandler}
                        error={validationErrors.state}
                    />
                </div>
                <div className="flex gap-3">
                    <InputField
                        placeholder="Zip Code"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={onChangeHandler}
                        error={validationErrors.zipcode}
                    />
                    <InputField
                        placeholder="Country"
                        name="country"
                        value={formData.country}
                        onChange={onChangeHandler}
                        error={validationErrors.country}
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-24"
                    >
                        {countryCodes.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.code} ({c.country})
                            </option>
                        ))}
                    </select>
                    <InputField
                        placeholder="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={onChangeHandler}
                        error={validationErrors.phone}
                    />
                </div>
            </div>

            {/* Right: Cart & Payment */}
            <div className="mt-8">
                <CartTotal />
                <div className="mt-12">
                    <Title text1="PAYMENT" text2="METHOD" />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div
                            onClick={() => setMethod("stripe")}
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer`}
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""
                                    }`}
                            ></p>
                            <img src={assets.stripe_logo} alt="" className="h-5 mx-4" />
                        </div>
                        <div
                            onClick={() => setMethod("razorpay")}
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer`}
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""
                                    }`}
                            ></p>
                            <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
                        </div>
                        <div
                            onClick={() => setMethod("cod")}
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer`}
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""
                                    }`}
                            ></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">
                                CASH ON DELIVERY
                            </p>
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        <button
                            type="submit"
                            className="px-16 py-3 text-sm bg-black text-white"
                        >
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;

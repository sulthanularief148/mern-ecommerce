import { useContext, useEffect, useState } from "react";
import { assets } from "../assets";
import { CartTotal, Title, InputField } from "../components";
import { ShopContext } from "../context/ShopContext";
import { handleAxiosError } from "../../utils/handleAxiosError";
import * as orderApi from "../services/orderApi";
import * as loyaltyApi from "../services/loyaltyApi";
import { deliveryMethodsFor, estimatedDeliveryDate } from "../constant/checkout";
import { toast } from "react-toastify";

const countryCodes = [
    { code: "+1", country: "USA" },
    { code: "+91", country: "India" },
    { code: "+44", country: "UK" },
];

const STEPS = [
    { key: "customer", label: "Customer Info" },
    { key: "shipping", label: "Shipping" },
    { key: "delivery", label: "Delivery" },
    { key: "payment", label: "Payment" },
    { key: "summary", label: "Review & Place" },
];

const CUSTOMER_FIELDS = ["firstName", "lastName", "email", "phone"];
const SHIPPING_FIELDS = ["street", "city", "state", "zipcode", "country"];

const Checkout = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [method, setMethod] = useState("cod");
    const [submitting, setSubmitting] = useState(false);
    const {
        navigate, cartItems, loadCart, currency,
        appliedCoupon, removeCoupon, deliveryMethod, setDeliveryMethod, storeSettings,
    } = useContext(ShopContext);
    const deliveryMethods = deliveryMethodsFor(storeSettings);

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "", countryCode: "+91",
        street: "", zipcode: "", city: "", state: "", country: "",
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loyaltyBalance, setLoyaltyBalance] = useState(0);
    const [redeemPointsInput, setRedeemPointsInput] = useState("");
    const [appliedPoints, setAppliedPoints] = useState(0);
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [applyingPoints, setApplyingPoints] = useState(false);

    useEffect(() => {
        loyaltyApi.fetchLoyaltySummary().then((d) => setLoyaltyBalance(d.balance)).catch(() => {});
    }, []);

    const applyPoints = async () => {
        const points = Number(redeemPointsInput);
        if (!points || points <= 0) {
            toast.error("Enter a number of points to redeem");
            return;
        }
        setApplyingPoints(true);
        try {
            const quote = await loyaltyApi.quoteRedemption(points);
            setAppliedPoints(quote.points);
            setAppliedDiscount(quote.discount);
            toast.success(`Applied ${quote.points} points (-${currency}${quote.discount})`);
        } catch (error) {
            toast.error(handleAxiosError(error, "Failed to apply points"));
        } finally {
            setApplyingPoints(false);
        }
    };

    const removeAppliedPoints = () => {
        setAppliedPoints(0);
        setAppliedDiscount(0);
        setRedeemPointsInput("");
    };

    const validateField = (name, value) => {
        switch (name) {
            case "email":
                return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email format.";
            case "zipcode":
                return /^\d{5,6}$/.test(value) ? "" : "Invalid Zip Code.";
            default:
                return value.trim() ? "" : "This field is required.";
        }
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateFields = (fields) => {
        const errors = {};
        let isValid = true;
        fields.forEach((name) => {
            const error = validateField(name, formData[name]);
            if (error) isValid = false;
            errors[name] = error;
        });
        setValidationErrors((prev) => ({ ...prev, ...errors }));
        return isValid;
    };

    const goNext = () => {
        if (stepIndex === 0 && !validateFields(CUSTOMER_FIELDS)) {
            toast.error("Please fill out your details correctly.");
            return;
        }
        if (stepIndex === 1 && !validateFields(SHIPPING_FIELDS)) {
            toast.error("Please fill out your shipping address correctly.");
            return;
        }
        setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    };

    const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

    const onPlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }
        const address = { ...formData, phone: `${formData.countryCode}${formData.phone}` };
        const orderOptions = { couponCode: appliedCoupon?.code, deliveryMethod, redeemPoints: appliedPoints || undefined };
        setSubmitting(true);

        try {
            switch (method) {
                case "cod": {
                    const order = await orderApi.placeOrderCOD(address, orderOptions);
                    toast.success("Order placed successfully");
                    await loadCart();
                    removeCoupon();
                    navigate(`/order/success/${order.id}`);
                    break;
                }
                case "stripe": {
                    const { sessionUrl } = await orderApi.placeOrderStripe(address, orderOptions);
                    window.location.href = sessionUrl;
                    break;
                }
                case "razorpay": {
                    const { order, orderId } = await orderApi.placeOrderRazorpay(address, orderOptions);
                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_API_KEY,
                        amount: order.amount,
                        currency: order.currency,
                        name: "Webfarm's Wear",
                        description: "Order Payment",
                        order_id: order.id,
                        handler: async (res) => {
                            try {
                                await orderApi.verifyRazorpay(res);
                                toast.success("Payment successful");
                                await loadCart();
                                removeCoupon();
                                navigate(`/order/success/${orderId}`);
                            } catch (err) {
                                toast.error(handleAxiosError(err, "Payment verification failed"));
                            }
                        },
                    };
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            toast.error(handleAxiosError(error, "Failed to place order"));
        } finally {
            setSubmitting(false);
        }
    };

    const currentStep = STEPS[stepIndex].key;

    return (
        <div className="pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* Step indicator */}
            <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 px-2">
                {STEPS.map((step, idx) => (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors duration-250 ${
                                idx < stepIndex ? "bg-accent-600 border-accent-600 text-white"
                                : idx === stepIndex ? "border-accent-600 text-accent-600 ring-4 ring-accent-100"
                                : "border-gray-200 text-gray-300"
                            }`}>
                                {idx < stepIndex ? "✓" : idx + 1}
                            </div>
                            <span className={`text-[11px] hidden sm:block ${idx <= stepIndex ? "text-ink" : "text-gray-300"}`}>{step.label}</span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${idx < stepIndex ? "bg-accent-600" : "bg-gray-200"}`} />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-8">
                <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                    {currentStep === "customer" && (
                        <>
                            <Title text1="CUSTOMER" text2="INFORMATION" />
                            <div className="flex gap-3">
                                <InputField placeholder="First Name" name="firstName" value={formData.firstName} onChange={onChangeHandler} error={validationErrors.firstName} />
                                <InputField placeholder="Last Name" name="lastName" value={formData.lastName} onChange={onChangeHandler} error={validationErrors.lastName} />
                            </div>
                            <InputField placeholder="Email" name="email" type="email" value={formData.email} onChange={onChangeHandler} error={validationErrors.email} />
                            <div className="flex gap-3">
                                <select
                                    value={formData.countryCode}
                                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                    className="border border-gray-200 rounded-xl py-1.5 px-3.5 w-24 bg-gray-50 focus:border-accent-500 outline-none"
                                >
                                    {countryCodes.map((c) => (
                                        <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                                    ))}
                                </select>
                                <InputField placeholder="Phone Number" name="phone" type="tel" value={formData.phone} onChange={onChangeHandler} error={validationErrors.phone} />
                            </div>
                        </>
                    )}

                    {currentStep === "shipping" && (
                        <>
                            <Title text1="SHIPPING" text2="ADDRESS" />
                            <InputField placeholder="Street Address" name="street" value={formData.street} onChange={onChangeHandler} error={validationErrors.street} />
                            <div className="flex gap-3">
                                <InputField placeholder="City" name="city" value={formData.city} onChange={onChangeHandler} error={validationErrors.city} />
                                <InputField placeholder="State" name="state" value={formData.state} onChange={onChangeHandler} error={validationErrors.state} />
                            </div>
                            <div className="flex gap-3">
                                <InputField placeholder="Zip Code" name="zipcode" value={formData.zipcode} onChange={onChangeHandler} error={validationErrors.zipcode} />
                                <InputField placeholder="Country" name="country" value={formData.country} onChange={onChangeHandler} error={validationErrors.country} />
                            </div>
                        </>
                    )}

                    {currentStep === "delivery" && (
                        <>
                            <Title text1="DELIVERY" text2="METHOD" />
                            <div className="flex flex-col gap-3">
                                {Object.entries(deliveryMethods).map(([key, opt]) => (
                                    <div
                                        key={key}
                                        onClick={() => setDeliveryMethod(key)}
                                        className={`flex items-center justify-between gap-3 border rounded-xl p-4 cursor-pointer transition-colors duration-250 ${deliveryMethod === key ? "border-accent-600 bg-accent-50" : "border-gray-200 hover:border-gray-400"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <p className={`min-w-3.5 h-3.5 border rounded-full ${deliveryMethod === key ? "bg-accent-500 border-accent-500" : ""}`}></p>
                                            <div>
                                                <p className="text-sm font-medium">{opt.label}</p>
                                                <p className="text-xs text-gray-400">Arrives {estimatedDeliveryDate(key)}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {key === "STANDARD"
                                                ? `${currency}${opt.fee} (free over ${currency}${storeSettings?.freeShippingThreshold ?? 999})`
                                                : `${currency}${opt.fee}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {currentStep === "payment" && (
                        <>
                            <Title text1="PAYMENT" text2="METHOD" />
                            <div className="flex gap-3 flex-col">
                                <div onClick={() => setMethod("stripe")} className={`flex items-center gap-3 border rounded-xl p-2 px-3 cursor-pointer transition-colors duration-250 ${method === "stripe" ? "border-accent-600" : "border-gray-200 hover:border-gray-400"}`}>
                                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-accent-500 border-accent-500" : ""}`}></p>
                                    <img src={assets.stripe_logo} alt="" className="h-5 mx-4" />
                                </div>
                                <div onClick={() => setMethod("razorpay")} className={`flex items-center gap-3 border rounded-xl p-2 px-3 cursor-pointer transition-colors duration-250 ${method === "razorpay" ? "border-accent-600" : "border-gray-200 hover:border-gray-400"}`}>
                                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-accent-500 border-accent-500" : ""}`}></p>
                                    <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
                                </div>
                                <div onClick={() => setMethod("cod")} className={`flex items-center gap-3 border rounded-xl p-2 px-3 cursor-pointer transition-colors duration-250 ${method === "cod" ? "border-accent-600" : "border-gray-200 hover:border-gray-400"}`}>
                                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-accent-500 border-accent-500" : ""}`}></p>
                                    <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                                </div>
                            </div>
                        </>
                    )}

                    {currentStep === "summary" && (
                        <>
                            <Title text1="ORDER" text2="SUMMARY" />
                            <div className="text-sm text-gray-600 flex flex-col gap-3">
                                <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/60">
                                    <p className="font-medium text-ink mb-1">Contact</p>
                                    <p>{formData.firstName} {formData.lastName}</p>
                                    <p>{formData.email}</p>
                                    <p>{formData.countryCode}{formData.phone}</p>
                                </div>
                                <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/60">
                                    <p className="font-medium text-ink mb-1">Shipping Address</p>
                                    <p>{formData.street}</p>
                                    <p>{formData.city}, {formData.state}, {formData.country} {formData.zipcode}</p>
                                </div>
                                <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/60">
                                    <p className="font-medium text-ink mb-1">Delivery & Payment</p>
                                    <p>{deliveryMethods[deliveryMethod].label} — arrives {estimatedDeliveryDate(deliveryMethod)}</p>
                                    <p className="capitalize">{method === "cod" ? "Cash on Delivery" : method}</p>
                                </div>

                                {loyaltyBalance > 0 && (
                                    <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/60">
                                        <p className="font-medium text-ink mb-1">Loyalty Points ({loyaltyBalance} available)</p>
                                        {appliedPoints > 0 ? (
                                            <div className="flex items-center justify-between">
                                                <p className="text-accent-600">{appliedPoints} points applied (-{currency}{appliedDiscount})</p>
                                                <button type="button" onClick={removeAppliedPoints} className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2">Remove</button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={loyaltyBalance}
                                                    value={redeemPointsInput}
                                                    onChange={(e) => setRedeemPointsInput(e.target.value)}
                                                    placeholder={`Up to ${loyaltyBalance}`}
                                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-accent-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={applyPoints}
                                                    disabled={applyingPoints}
                                                    className="px-4 py-1.5 text-xs bg-ink text-white rounded-lg hover:bg-accent-600 transition-colors duration-250 disabled:opacity-60"
                                                >
                                                    {applyingPoints ? "Applying…" : "Apply"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="flex justify-between mt-4">
                        {stepIndex > 0 ? (
                            <button type="button" onClick={goBack} className="px-6 py-2.5 text-sm border border-gray-300 rounded-full hover:border-gray-400 transition-colors duration-250">
                                Back
                            </button>
                        ) : <span />}
                        {stepIndex < STEPS.length - 1 && (
                            <button type="button" onClick={goNext} className="px-8 py-2.5 text-sm bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250">
                                Continue
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-2 w-full sm:max-w-[420px]">
                    <CartTotal />
                    {currentStep === "summary" && (
                        <div className="w-full text-end mt-8">
                            <button
                                type="button"
                                onClick={onPlaceOrder}
                                disabled={submitting}
                                className="px-16 py-3 text-sm bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? "PLACING ORDER…" : "PLACE ORDER"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;

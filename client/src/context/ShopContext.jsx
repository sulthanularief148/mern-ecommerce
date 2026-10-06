import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "../../utils/handleAxiosError";
import { setAccessToken, setAuthChangeListener, refreshAccessToken, backendurl } from "../lib/apiClient";
import * as authApi from "../services/authApi";
import * as productApi from "../services/productApi";
import * as cartApi from "../services/cartApi";
import * as wishlistApi from "../services/wishlistApi";
import * as couponApi from "../services/couponApi";
import * as settingsApi from "../services/settingsApi";

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = "₹"
    const [search, setSearch] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [products, setProducts] = useState([])
    const [productsLoaded, setProductsLoaded] = useState(false)
    const [user, setUser] = useState(null)
    const [authReady, setAuthReady] = useState(false)
    const [appliedCoupon, setAppliedCoupon] = useState(null) // { code, discountAmount, type, value }
    const [couponLoading, setCouponLoading] = useState(false)
    const [deliveryMethod, setDeliveryMethod] = useState("STANDARD")
    const [storeSettings, setStoreSettings] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        settingsApi.fetchPublicSettings().then(setStoreSettings).catch(() => {});
    }, []);

    const token = Boolean(user)

    const loadCart = useCallback(async () => {
        try {
            const items = await cartApi.fetchCart();
            setCartItems(items);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }, []);

    const getProducts = useCallback(async () => {
        try {
            const list = await productApi.fetchProducts();
            setProducts(list);
        } catch (error) {
            toast.error(handleAxiosError(error, "Failed to load products. Please try again later."));
        } finally {
            setProductsLoaded(true);
        }
    }, []);

    const addToCart = async (productId, size) => {
        if (!size) {
            toast.error("Please select the size");
            return;
        }
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await cartApi.addCartItem({ productId, size, quantity: 1 });
            await loadCart();
        } catch (error) {
            toast.error(handleAxiosError(error, "Failed to add item to cart"));
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            if (quantity <= 0) {
                await cartApi.removeCartItem(itemId);
            } else {
                await cartApi.updateCartItem(itemId, quantity);
            }
            await loadCart();
        } catch (error) {
            toast.error(handleAxiosError(error, "Failed to update cart"));
        }
    };

    const getCartCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const getCartAmount = () => cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    const applyCoupon = async (code) => {
        setCouponLoading(true);
        try {
            const result = await couponApi.validateCoupon(code, getCartAmount());
            setAppliedCoupon(result);
            toast.success(`Coupon "${result.code}" applied — you saved ${currency}${result.discountAmount}`);
            return result;
        } catch (error) {
            setAppliedCoupon(null);
            toast.error(handleAxiosError(error, "Invalid coupon code"));
            throw error;
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => setAppliedCoupon(null);

    const loadWishlist = useCallback(async () => {
        try {
            const items = await wishlistApi.fetchWishlist();
            setWishlist(items);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    }, []);

    const isWishlisted = (productId) => wishlist.some((item) => item.productId === productId);

    const toggleWishlist = async (productId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            if (isWishlisted(productId)) {
                await wishlistApi.removeFromWishlist(productId);
                toast.success("Removed from wishlist");
            } else {
                await wishlistApi.addToWishlist(productId);
                toast.success("Added to wishlist");
            }
            await loadWishlist();
        } catch (error) {
            toast.error(handleAxiosError(error, "Failed to update wishlist"));
        }
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        setCartItems([]);
        setWishlist([]);
        setAppliedCoupon(null);
        navigate('/login');
    };

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    // Silent refresh on load: the access token only ever lives in memory, so
    // a hard refresh loses it — this exchanges the httpOnly refresh cookie
    // (if any) for a fresh access token without the user re-entering a password.
    useEffect(() => {
        setAuthChangeListener((newToken) => {
            if (!newToken) {
                setUser(null);
                setCartItems([]);
            }
        });

        (async () => {
            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    const me = await authApi.fetchMe();
                    setUser(me);
                }
            } catch {
                setAccessToken(null);
            } finally {
                setAuthReady(true);
            }
        })();
    }, []);

    useEffect(() => {
        if (user) {
            loadCart();
            loadWishlist();
        }
    }, [user, loadCart, loadWishlist]);

    const value = {
        currency, products, productsLoaded, search, setSearch, showSearch, setShowSearch,
        navigate, cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, backendurl,
        token, user, setUser, authReady, logout, loadCart,
        wishlist, loadWishlist, isWishlisted, toggleWishlist,
        appliedCoupon, couponLoading, applyCoupon, removeCoupon,
        deliveryMethod, setDeliveryMethod, storeSettings,
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;

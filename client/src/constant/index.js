import { assets } from "../assets";

/*--------------------------------------------------------------------------------Navigation---------------------------------------------------------------------------------*/
export const navMenu = [
    {
        id: 1,
        link: "HOME",
        path: "/"
    },
    {
        id: 2,
        link: "ABOUT",
        path: "/about"
    },
    {
        id: 3,
        link: "COLLECTION",
        path: "/collection"
    },
    {
        id: 4,
        link: "CONTACT",
        path: "/contact"
    }
]

export const profileMenuText = [
    {
        id: 1,
        title: "My Profile",
        path: '/profile'

    },
    {
        id: 2,
        title: "Orders",
        path: '/orders'

    },
    // {
    //     id: 3,
    //     title: "Logout",
    //     path: ''

    // },
]

/*====================================================================================PAGES==================================================================================*/
/*--------------------------------------------------------------------------------Collection Page----------------------------------------------------------------------------*/
export const filters = [
    { title: "CATEGORIES", options: ['Men', 'Women', 'Kids'] },
    { title: "SUBCATEGORY", options: ['Topwear', 'Bottomwear', 'Winterwear'] }
]

export const collectionContent = {
    filterTitle: "FILTERS",
    title: {
        text1: "ALL",
        text2: "COLLECTION"
    },
    sortingOptions: [
        { value: "relevent", label: "Sort by : Relavent" },
        { value: "low-high", label: "Sort by : Low to High" },
        { value: "high-low", label: "Sort by : High to Low" }
    ]
}

/*-------------------------------------------------------------------------------- About Page--------------------------------------------------------------------------------*/
export const content = {
    aboutContent: {
        title1: "ABOUT",
        title2: "US",
        missionTitle: "Our Mission",
        missionText: "At Textilem, our mission is to blend timeless tradition with modern elegance. We are committed to delivering high-quality textile products that celebrate culture, craftsmanship, and style—ensuring every customer feels confident and beautiful in what they wear.",
        section1Text: "With a deep-rooted passion for fabrics and fashion, we bring you a curated collection of exquisite dresses and textiles that represent both heritage and innovation. Every piece is thoughtfully designed to cater to the dynamic preferences of our diverse clientele.",
        section2Text: "From sourcing premium materials to ensuring impeccable finishing, we focus on every detail to offer products that stand out for their beauty, durability, and comfort. Our collections reflect a rich tapestry of culture, creativity, and commitment to excellence.",
        qualityAssurance: {
            title: "Quality Assurance",
            description: "We take pride in offering only the finest fabrics and garments. Every product undergoes rigorous quality checks to ensure it meets our high standards of design, durability, and craftsmanship—so you receive nothing but the best."
        },
        convenience: {
            title: "Convenience",
            description: "Shopping with us is effortless and enjoyable. From an intuitive online experience to quick delivery and easy returns, we ensure your journey with us is smooth, convenient, and tailored to your lifestyle."
        },
        customerService: {
            title: "Exceptional Customer Service",
            description: "Your satisfaction is our priority. Our dedicated support team is always ready to assist you with inquiries, orders, and feedback—ensuring you feel valued and heard at every step of your shopping experience."
        }
    }
};

/*-------------------------------------------------------------------------------- Login Page--------------------------------------------------------------------------------*/
export const loginContent = {
    title: "Login", // Initial state
    buttonText: {
        login: "Login",
        signUp: "Sign Up"
    },
    placeholders: {
        email: "Email",
        password: "Password",
        name: "Name" // Will be conditionally shown
    },
    forgotPassword: "Forgot your password?",
    createAccount: "Create Account",
    login: "Login"
};

/*-------------------------------------------------------------------------------- Order Page--------------------------------------------------------------------------------*/
export const orderContent = {
    title1: "MY",
    title2: "ORDERS",
    orderDate: "25 Dec 2024",
};

/*-------------------------------------------------------------------------------- Contact Page------------------------------------------------------------------------------*/
export const contactContent = {
    title: {
        part1: "CONTACT",
        part2: "US"
    },
    store: {
        title: "Our Store",
        address: "3/12,  Royal Street, Chennai",
        phone: "+91 8248566678",
        email: "support@ecofashion.com"
    },
    careers: {
        title: "Careers at Ecofashion",
        description: "Learn more about Team and openings",
        buttonText: "Explore jobs"
    }
};
/*-------------------------------------------------------------------------------- Product Page------------------------------------------------------------------------------*/
export const productContent = {
    descriptionTitle: "Description",
    reviewTitle: "Review",
    features: [
        "100% Original Product",
        "Cash on delivery available on this product",
        "Easy return and Exchange Policy within 7 days"
    ],
    sizeSelector: "Select Size",
    addToCartButton: "ADD TO CART"
};


/*====================================================================================PAGES END==================================================================================*/



/*===================================================================================COMPONENTS START=========================================================================*/
/*----------------------------------------------------------------------------Newsletter component from Home page------------------------------------------------------------*/
export const newsLetterContent = {
    title: "Subscribe Now & get 20% off",
    subtitle: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat, repudiandae sapiente soluta, quaerat ab cum molestiae quasi provident id esse ex in maxime. Accusamus, quis molestiae excepturi dolorum eligendi quos?",
    form: {
        placeholder: "Enter your email",
        buttonText: "SUBSCRIBE"
    }
}

/*----------------------------------------------------------------------------Hero Component from Home page------------------------------------------------------------------*/
export const heroContent = {
    bestSeller: "BEST SELLER",
    title: "Latest Arrivals",
    shopNow: "SHOP NOW",
    heroImage: assets.hero_img
}


/*----------------------------------------------------------------------------Best seller component from Home page-----------------------------------------------------------*/
export const bestSellerContent = {
    title: "BEST SELLER",
    subtitle: "Discover our best-selling styles, loved by thousands! From timeless traditional wear to modern ethnic designs, these top picks combine comfort, elegance, and quality craftsmanship. Each piece reflects exceptional artistry and trend-forward details that make it a wardrobe favorite."
};

/*----------------------------------------------------------------------------Latest Collection component from Home Page-----------------------------------------------------*/
export const latestCollectionContent = {
    title: "LATEST COLLECTION",
    subtitle: "Step into the season with our latest collection – a perfect blend of fresh trends and classic charm. Explore vibrant colors, luxurious fabrics, and unique designs inspired by contemporary fashion and traditional roots. Curated to suit every mood and moment."
};

/*----------------------------------------------------------------------------Home Page Footer-------------------------------------------------------------------------------*/
export const policies = [
    { image: assets.exchange_icon, text1: 'Exchange Policy', text2: 'Lorem ipsum dolor sit amet, consectetur' },
    { image: assets.quality_icon, text1: '7 Return Policy', text2: 'We accept hassle-free returns with in 7 days' },
    { image: assets.support_img, text1: 'Shipping Policy', text2: 'Fast and reliable shipping worldwide' },
];

/*---------------------------------------------------------------------------Footer content from Home page-------------------------------------------------------------------*/
export const footerContent = {
    logo: assets.logo,
    subtitle: `we craft more than just clothes – we bring culture to life through fabric. Specializing in high-quality textiles and elegant dresses, we are dedicated to delivering comfort, style, and authenticity in every thread. Join us on a journey of fashion rooted in tradition and tailored for today.`,
    company: [
        { id: 1, name: "HOME" },
        { id: 2, name: "ABOUT US" },
        { id: 3, name: "DELIVERY" },
        { id: 4, name: "PRIVACY POLICY" }
    ],
    contact: [
        { id: 1, info: "+91 8248566678" },
        { id: 2, info: "support@ecofashion.com" }
    ],
    copyright: `Copyright ${new Date().getFullYear()}@ EcoFashion. All rights reserved.`
}



/*===================================================================================COMPONENTS END=========================================================================*/
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
        missionText: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum odio praesentium necessitatibus voluptatibus officia eos totam laudantium maxime harum labore atque eveniet officiis ad doloremque velit, repellendus soluta? Quod, atque!",
        section1Text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta iure magnam fuga sed veritatis laboriosam adipisci laudantium accusantium itaque cum expedita fugit ut, corporis eius illum dicta, repellendus animi molestias.",
        section2Text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum odio praesentium necessitatibus voluptatibus officia eos totam laudantium maxime harum labore atque eveniet officiis ad doloremque velit, repellendus soluta? Quod, atque!",
        qualityAssurance: {
            title: "Quality Assurance",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quaerat facere illum, obcaecati, omnis aspernatur voluptate, molestias repellat commodi quibusdam esse consequatur. Sint consequatur sapiente odit distinctio? Cupiditate, consectetur harum!"
        },
        convenience: {
            title: "Convenience",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quaerat facere illum, obcaecati, omnis aspernatur voluptate, molestias repellat commodi quibusdam esse consequatur. Sint consequatur sapiente odit distinctio? Cupiditate, consectetur harum!"
        },
        customerService: {
            title: "Exceptional Customer Service",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quaerat facere illum, obcaecati, omnis aspernatur voluptate, molestias repellat commodi quibusdam esse consequatur. Sint consequatur sapiente odit distinctio? Cupiditate, consectetur harum!"
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
        address: "34657 Royal Street, Chennai",
        phone: "+91 8248566678",
        email: "support@webfarmtech.com"
    },
    careers: {
        title: "Careers at Webfarm",
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
    subtitle: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate vero maiores laborum neque omnis."
};

/*----------------------------------------------------------------------------Latest Collection component from Home Page-----------------------------------------------------*/
export const latestCollectionContent = {
    title: "LATEST COLLECTION",
    subtitle: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate vero maiores laborum neque omnis."
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
    subtitle: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum nesciunt ad enim! Ipsum maiores dignissimos laudantium, recusandae pariatur odio sunt natus et, reprehenderit dolorem cum tempore dolor ea saepe voluptatibus.`,
    company: [
        { id: 1, name: "HOME" },
        { id: 2, name: "ABOUT US" },
        { id: 3, name: "DELIVERY" },
        { id: 4, name: "PRIVACY POLICY" }
    ],
    contact: [
        { id: 1, info: "+91 8248566678" },
        { id: 2, info: "support@webfarmtech.com" }
    ],
    copyright: `Copyright ${new Date().getFullYear()}@ WebFarmTech. All rights reserved.`
}



/*===================================================================================COMPONENTS END=========================================================================*/
import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors'
import helmet from 'helmet';
import connectDB from './config/mongodb.js'
import cloudinaryConnect from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from "./routes/cartRoute.js"
import orderRouter from './routes/orderRoute.js';
dotenv.config();

// App Config
const app = express()
const port = process.env.PORT || 3000


// Connect to MongoDB
connectDB()
    .then(() => {
        console.log('Connected to MongoDB Successfully')
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    });

// Cloudinary Connection
cloudinaryConnect()
    .then(() => {
        console.log('Connected to Cloudinary Successfully')
    })
    .catch((error) => {
        console.error('Failed to connect to Cloudinary:', error);
    })

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://mern-ecommerce-frontend-blush.vercel.app',
    'https://mern-ecommerce-adminpanel.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));


app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => console.log(`The server running on PORT ${port}`))
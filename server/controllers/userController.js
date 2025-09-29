import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import validator from 'validator'
import passwordValidator from 'password-validator';

const createToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist. Please register." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Create token
        const token = await createToken(user._id);
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error occurred during login. Please try again later."
        });
    }
};


const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if already registered
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(409).json({ success: false, message: "User already exists. Try logging in." });
        }

        // Required fields check
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format." });
        }

        // Password validation
        const schema = new passwordValidator();
        schema
            .is().min(8)
            .is().max(20)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().symbols();

        if (!schema.validate(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be 8-20 characters and include uppercase, lowercase, numbers, and symbols."
            });
        }

        // Hash and save user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        const token = await createToken(newUser._id);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });

    } catch (error) {
        console.error("Register Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error occurred during registration. Please try again later."
        });
    }
};



const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const isMatch = await bcrypt.compare(password, hashedAdminPassword);

        if (email === process.env.ADMIN_EMAIL && isMatch) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
            return res.status(200).json({ success: true, message: "Admin successfully logged in", token });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: `Error occurred while admin Login ${error.message}` });
    }
}


// const adminLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const hashedAdminPassword = bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
//         if (email === process.env.ADMIN_EMAIL || password === process.env.ADMIN_PASSWORD) {
//             const token = jwt.sign(email + password, process.env.JWT_SECRET_KEY)
//             return res.status(200).json({ success: true, message: "Admin Successfully Logged in", token: token });
//         } else {
//             return res.json({ success: false, message: "Invalid Credentials" });
//         }


//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: `Error occurred while admin Login ${error.message}` })
//     }
// }

export { adminLogin, userLogin, userRegister };
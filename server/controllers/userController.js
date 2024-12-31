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
        const user = await userModel.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = await createToken(user._id);
            res.json({ success: true, message: "Logged in successfully", token });

        } else {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: `Error occurred while Login user ${error.message}` })
    }
}


const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await userModel.findOne({ email })
        if (exist) {
            return res.status(400).json({ message: "User already exists" })
        }
        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }
        if (!email || !password) {
            return res.json({ success: false, message: "Email and Password are required." });
        }


        const schema = new passwordValidator();
        schema
            .is().min(8)
            .is().max(20)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().symbols();
        if (!schema.validate(password)) {
            return res.json({ success: false, message: "Password must be at least 8 characters long and include uppercase, lowercase, digits, and special characters." });
        }
        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = await createToken(user._id)
        res.json({ success: true, token: token, message: "User created successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: `Error occurred while registering user ${error.message}` })

    }
}


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
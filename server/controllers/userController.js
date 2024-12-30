import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import validator from 'validator'
const createToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY)
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

        // Check user already exists or not
        const exist = await userModel.findOne({ email })
        if (exist) {
            return res.status(400).json({ message: "User already exists" })
        }
        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }
        if (password.length > 8) {
            return res.json({ success: false, message: "Password should be at least 8 characters" });
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
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL || password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET_KEY)
            return res.status(200).json({ success: true, message: "Admin Successfully Logged in", token: token });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: `Error occurred while admin Login ${error.message}` })
    }
}

export { adminLogin, userLogin, userRegister };
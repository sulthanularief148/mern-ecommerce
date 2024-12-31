import jwt from 'jsonwebtoken'
const adminAuth = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
        //     return res.status(401).json({ success: false, message: 'Not Authorized Login Again' });
        // }
        if (decodedToken.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: `Token Error: ${error.message}` });
    }
};

export default adminAuth;

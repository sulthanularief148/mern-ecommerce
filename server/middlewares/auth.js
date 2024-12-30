import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.json({ success: false, message: 'No token, authorization denied' });
    }

 
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({ success: false, message: 'Malformed token, authorization denied' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Token is not valid' });
    }
};

export default authUser;

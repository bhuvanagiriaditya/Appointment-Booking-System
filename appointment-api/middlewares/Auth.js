const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
    const auth_header = req.headers.authorization;
    if (!auth_header || auth_header.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "no token provided"
        })
    }
    const token = auth_header.split('  ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();


    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
}
module.exports={protect};
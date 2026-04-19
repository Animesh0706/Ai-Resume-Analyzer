const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1]?.trim();
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token"
        });
    }
};

module.exports = authMiddleware;
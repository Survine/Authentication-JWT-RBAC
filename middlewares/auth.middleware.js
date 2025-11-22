import jwt from "jsonwebtoken";

export const authenticationMiddleware = async (req, res, next) => {
    try {
        const tokenHeader = req.headers["authorization"];

        //Header authorization: Bearer <Token>

        if (!tokenHeader) {
            return next();
        }

        if (!tokenHeader.startsWith("Bearer")) {
            return res.status(400).json({ error: "Authorization header must start with Bearer" });
        }

        const token = tokenHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        next();
    }
};

export const ensureAuthenticated = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "You must be authenticated" });
    }

    next();
};

export const restrictToRole = function (role) { //its a closure function
    return function (req, res, next) {
        if ((req.user.role !== role)) {
            return res.status(401).json({ error: "You are not authorized to access this resource" });
        }
        return next();
    };
};

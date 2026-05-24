const userModel = require('../models/user.model');
const serviceproviderModel = require('../models/sprovider.model');
const jwt = require('jsonwebtoken');

async function authUserMiddleware(req, res, next) {
    // accept token from cookie or Authorization header
    const token = req.cookies?.token || (req.headers?.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ message: 'please login first' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "user") {
            return res.status(403).json({ message: "User access only" });
        }

        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'invalid token' });
    }
}

async function authSproviderMiddleware(req, res, next) {
    // accept token from cookie or Authorization header
    const token = req.cookies?.token || (req.headers?.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ message: 'please login first' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded.role);
        if (decoded.role !== "provider") {
            return res.status(403).json({ message: "Service Provider access only" });
        }
        const serviceprovider = await serviceproviderModel.findById(decoded.id);
        req.serviceprovider = serviceprovider;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'invalid token' });
    }
}


function authCommonMiddleware(req, res, next) {
  // accept token from cookie or Authorization header
  const token = req.cookies?.token || (req.headers?.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
    authUserMiddleware,
    authSproviderMiddleware,
    authCommonMiddleware
};
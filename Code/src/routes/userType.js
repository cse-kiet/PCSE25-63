const restrictToUserType = (allowedUserTypes) => {
    return (req, res, next) => {
        const userType = req.session.userType;
        if (allowedUserTypes.includes(userType)) {
            // User is allowed to access this module, proceed to the next middleware or route handler
            next();
        } else {
            // User is not allowed to access this module, redirect to appropriate page or send 403 Forbidden status
            res.status(403).send(`You can't access this module because you're logged as a ${userType}`);
        }
    };
};

// Middleware for authentication
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated, allow access to the next middleware or route handler
        next();
    } else {
        // User is not authenticated, redirect to login page
        res.redirect('/login');
    }
};

module.exports = { requireAuth, restrictToUserType };
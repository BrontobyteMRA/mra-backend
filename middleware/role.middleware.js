const User = require('../schemas/user.schema'); // Import the user schema from userModel.js

// Middleware to check role
function checkRole(role) {
    return async (req, res, next) => {
        const user = await User.findOne({ 'username': req.body.username });
        if (!user || user.role.toLowerCase() !== role.toLowerCase()) {

            return res.status(403).send('Forbidden');
        }
        req.user = user; // Attach user object to the request
        next();
    };
}

module.exports = { checkRole };


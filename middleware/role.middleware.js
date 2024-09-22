import User from '../schemas/user.schema.js'; // Ensure you import User correctly

export function checkRole(role) {
    return async (req, res, next) => {
        const user = await User.findOne({ 'username': req.body.username });
        if (!user || user.role.toLowerCase() !== role.toLowerCase()) {
            return res.status(403).send('Forbidden');
        }
        req.user = user; // Attach user object to the request
        next();
    };
}

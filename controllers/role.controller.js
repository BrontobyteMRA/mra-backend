export function adminPage(req, res) {
    res.send(`Welcome ${req.user.role}: ${req.user.username}`);
}

export function vendorPage(req, res) {
    res.send(`Welcome ${req.user.role}: ${req.user.username}`);
}

export function userPage(req, res) {
    res.send(`Welcome ${req.user.role}: ${req.user.username}`);
}

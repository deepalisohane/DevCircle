export const adminAuth = (req, res, next) => {
    console.log("Admin Auth Middleware Triggered");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(403).send('Forbidden: Admins only');
    }
    else {
        next();
    }
}
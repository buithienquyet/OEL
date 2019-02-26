module.exports = function(req, res, next) {
    if (req.isUnauthenticated())
        res.redirect('/login.html');
    else
        next();
}
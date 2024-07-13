const { verifyToken } = require("./jwt");

const authCheck = (tokenName) => {
  return (req, res, next) => {
    const token = req.cookies[tokenName];
    if (!token) return next();

    const user = verifyToken(token);
    if (!user) return next();

    req.user = user;
    return next();
  };
};

module.exports = authCheck;

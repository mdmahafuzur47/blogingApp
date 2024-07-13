const jwt = require("jsonwebtoken");
const secrets = "mafuz";
const createUserToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    profileImg: user.profileImg,
  };
  const token = jwt.sign(payload, secrets);
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secrets);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createUserToken,
  verifyToken,
};

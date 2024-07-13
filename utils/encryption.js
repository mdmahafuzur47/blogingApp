const { hashSync, compareSync } = require("bcryptjs");

function hash(text, salt = 12) {
  return hashSync(text, salt);
}

function compare(text, hash) {
  return compareSync(text, hash);
}

module.exports = {
  hash,
  compare,
};

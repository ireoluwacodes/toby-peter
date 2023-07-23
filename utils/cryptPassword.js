const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (password, hash) => {
  const compare = await bcrypt.compare(password, hash);
  return compare;
};

module.exports = {
  hashPassword,
  comparePassword,
};

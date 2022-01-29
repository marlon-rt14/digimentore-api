const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const helper = {};

helper.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

helper.matchPassword = async (password, savedPassword) => {
  return await bcrypt.compare(password, savedPassword);
};

helper.getPrivateKey = () => {
  const pathFile = path.normalize(path.join(__dirname, "../../../../.."));
  // console.log(pathFile);
  const privateKey = fs
    .readFileSync(path.join(pathFile, "privateKey.txt"))
    .toString();
  // console.log(privateKey);
  return privateKey;
};

helper.getToken = (dataForToken = {}) => {
  // console.log(privateKey);
  const token = jwt.sign(dataForToken, helper.getPrivateKey());
  // console.log(token);
  return token;
};

module.exports = helper;

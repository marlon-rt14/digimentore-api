const jwt = require("jsonwebtoken");
const handleErrors = require("../../middlewares/handleErrors");

const { getPrivateKey } = require("../lib/helper");

module.exports = (req, res, next) => {
  const authorization = req.get("authorization");

  let token = "";

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, getPrivateKey());
  } catch (error) {
    return next(handleErrors(error, req, res, next));
  }

  if (!token || !decodedToken) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  req.userId = decodedToken.id;

  // handleErrors();
  // next(handleErrors());
  next();
};

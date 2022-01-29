const express = require("express");
const jwt = require("jsonwebtoken");
const handleErrors = require("../../middlewares/handleErrors");

const router = express.Router();

const pool = require("../database");
const {
  encryptPassword,
  matchPassword,
  getPrivateKey,
} = require("../lib/helper");

// Auxiliar route to create new data
router.get("/getHash/:fullname/:username/:password", async (req, res) => {
  const { fullname, username, password } = { ...req.params };
  // console.log(fullname, username, password);
  const newUser = { fullname, username, password };
  newUser.password = await encryptPassword(password);
  console.log(newUser);
  pool.query("INSERT INTO users SET ?", [newUser]);
  res.send("saved");
});

// Auxiliar route to update data
router.get("/getHash/:id/:fullname/:username/:password", async (req, res) => {
  const { id, fullname, username, password } = { ...req.params };
  const newUser = { fullname, username, password };
  newUser.password = await encryptPassword(password);
  console.log(newUser);
  pool.query("UPDATE users SET ? WHERE id_user = ?", [newUser, id]);
  res.send("saved");
});

router.post("/signin", async (req, res) => {
  const { username, password } = { ...req.body };
  // console.log(username, password);
  try {
    const users = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    // console.log(users);
    const verify =
      users[0] === undefined
        ? false
        : await matchPassword(password, users[0].password);
    // console.log(verify);

    if (!(users[0] && verify)) {
      return res.status(401).json({
        errorMsg: "Invalid username or password",
      });
    }

    const user = users[0];

    const userForToken = {
      id: user.id_user,
      fullname: user.fullname,
      username: user.username,
    };

    const privateKey = getPrivateKey();
    const token = jwt.sign(userForToken, privateKey, { expiresIn: "2 days" });

    res.json({ user, token: token });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  // res.json(users[0]);
});

router.post("/signup", async (req, res, next) => {
  const newUser = req.body;
  try {
    newUser.password = await encryptPassword(newUser.password);
    const response = await pool.query("INSERT INTO users SET ?", [newUser]);
    // console.log(response);
    const userForToken = {
      id: response.insertId,
      fullname: newUser.fullname,
      username: newUser.username,
    };

    const privateKey = getPrivateKey();
    const token = jwt.sign(userForToken, privateKey, { expiresIn: "2 days" });

    res.json({ user: userForToken, token });
  } catch (error) {
    return next(handleErrors(error, req, res, next));
  }
});

module.exports = router;

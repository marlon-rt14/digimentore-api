const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const pool = require("../database");
// const { getToken, matchToken } = require("../lib/helper");
const userExtractor = require("../lib/userExtractor");
const handleErrors = require("../../middlewares/handleErrors");

router.get("/links", userExtractor, async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM links WHERE id_user = ?", [
      req.userId,
    ]);
    // console.log(data);
    return res.json({ data });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/links", userExtractor, async (req, res) => {
  const newLink = req.body;
  newLink.id_user = req.userId;
  try {
    const response = await pool.query("INSERT INTO links SET ?", [newLink]);
    // console.log(response);
    const newData = await pool.query("SELECT * FROM links WHERE id_link = ?", [
      response.insertId,
    ]);
    return res.json(newData[0]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/links/:id", userExtractor, async (req, res) => {
  const id = { ...req.params };
  const data = req.body;
  try {
    const response = await pool.query("UPDATE links SET ? WHERE id_link = ?", [
      data,
      id.id,
    ]);
    // console.log(response);
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.delete("/links/:id", userExtractor, async (req, res) => {
  const id = { ...req.params };
  try {
    const data = await pool.query("SELECT * FROM links WHERE id_link = ?", [
      id.id,
    ]);
    const response = await pool.query("DELETE FROM links WHERE id_link = ?", [
      id.id,
    ]);
    // console.log(response);
    return res.json(data[0]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;

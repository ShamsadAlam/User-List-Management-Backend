const express = require("express");
const List = require("../models/List");
const router = express.Router();

router.post("/", async (req, res) => {
  const { title, customProperties } = req.body;
  const list = new List({ title, customProperties });
  try {
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

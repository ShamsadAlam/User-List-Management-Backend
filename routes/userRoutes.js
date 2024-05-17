const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const List = require("../models/List");
const User = require("../models/User");
const fs = require("fs");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload/:listId", upload.single("file"), async (req, res) => {
  const listId = req.params.listId;
  const list = await List.findById(listId);
  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      let addedCount = 0;
      let errorCount = 0;
      let errors = [];
      for (const row of results) {
        const { name, email, ...properties } = row;
        if (!name || !email) {
          errorCount++;
          errors.push({ ...row, error: "Name or email missing" });
          continue;
        }

        const userProperties = {};
        for (const prop of list.customProperties) {
          userProperties[prop.title] =
            properties[prop.title] || prop.fallbackValue;
        }

        const user = new User({
          name,
          email,
          properties: userProperties,
          list: listId,
        });

        try {
          await user.save();
          addedCount++;
        } catch (error) {
          errorCount++;
          errors.push({ ...row, error: error.message });
        }
      }

      res.json({
        addedCount,
        errorCount,
        totalCount: await User.countDocuments({ list: listId }),
        errors,
      });
    });
});

module.exports = router;

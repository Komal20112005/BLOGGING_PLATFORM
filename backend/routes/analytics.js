const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {

  db.query("SELECT COUNT(*) AS totalPosts FROM posts", (err, postResult) => {
    if (err) return res.status(500).json(err);

    db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, userResult) => {
      if (err) return res.status(500).json(err);

      db.query("SELECT COUNT(*) AS totalComments FROM comments", (err, commentResult) => {
        if (err) return res.status(500).json(err);

        res.json({
          totalPosts: postResult[0]?.totalPosts || 0,
          totalUsers: userResult[0]?.totalUsers || 0,
          totalComments: commentResult[0]?.totalComments || 0
        });
      });
    });
  });

});

module.exports = router;
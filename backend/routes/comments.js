const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Add comment
router.post("/", auth, (req, res) => {
  const { content, post_id } = req.body;

  db.query(
    "INSERT INTO comments (content, post_id, user_id) VALUES (?,?,?)",
    [content, post_id, req.user.id],
    () => res.send("Comment added")
  );
});

// Get comments by post
router.get("/:postId", (req, res) => {
  db.query(
    "SELECT * FROM comments WHERE post_id=? ORDER BY created_at DESC",
    [req.params.postId],
    (err, results) => res.json(results)
  );
});

module.exports = router;
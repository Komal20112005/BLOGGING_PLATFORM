const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/search", (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.json([]); // no input
  }

  const sql = `
    SELECT * FROM posts 
    WHERE title LIKE ? 
    OR content LIKE ? 
    OR tags LIKE ?
    ORDER BY created_at DESC
  `;

  const searchValue = `%${query}%`;

  db.query(
    sql,
    [searchValue, searchValue, searchValue],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json(results); // ✅ send matched posts
    }
  );
});

module.exports = router;
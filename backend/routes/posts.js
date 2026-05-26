const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { spawn } = require("child_process");

router.post("/", auth, (req, res) => {
  const { title, content, category, tags } = req.body;

  // 🔥 Step 1: Check toxicity
  const python = spawn("python", ["toxicity_model.py", content]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.on("close", () => {
    const output = result.trim();
    console.log("Toxicity Result:", output);

    // ❌ If toxic → STOP here
    if (output.includes("TOXIC")) {
      return res.json({
        success: false,
        message: "🚫 Toxic content detected!"
      });
    }

    // ✅ Step 2: Save to DB ONLY if safe
    db.query(
      "INSERT INTO posts (title, content, category, tags, user_id) VALUES (?,?,?,?,?)",
      [title, content, category, tags, req.user.id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // ✅ ONLY ONE RESPONSE HERE
        return res.json({
          success: true,
          message: "✅ Post created successfully"
        });
      }
    );
  });
});

// Delete post
router.delete("/:id", auth, (req, res) => {
  db.query("DELETE FROM posts WHERE id=?", [req.params.id], () => {
    res.send("Deleted");
  });
});

// Update post
router.put("/:id", auth, (req, res) => {
  const { title, content } = req.body;

  db.query(
    "UPDATE posts SET title=?, content=? WHERE id=?",
    [title, content, req.params.id],
    () => res.send("Updated")
  );
});
// Like post
router.post("/like/:id", auth, (req, res) => {
  db.query(
    "INSERT INTO likes (user_id, post_id) VALUES (?,?)",
    [req.user.id, req.params.id],
    () => res.send("Liked")
  );
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

 db.query(
  "SELECT * FROM posts LIMIT ? OFFSET ?",
  [limit, offset],
  (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  }
);
});

module.exports = router;
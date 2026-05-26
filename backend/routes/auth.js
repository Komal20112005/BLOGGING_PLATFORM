const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?,?)",
    [username, password],
    () => res.send("User registered")
  );
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, results) => {
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      const token = jwt.sign(
        { id: user.id, role: user.role }, // ✅ include role
        "secretkey"
      );

      res.json({
        token,
        role: user.role // ✅ send role to frontend
      });
    }
  );
});

module.exports = router;
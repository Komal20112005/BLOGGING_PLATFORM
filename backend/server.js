const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/admin", require("./routes/admin"));

// Routes
const searchRoutes = require("./routes/search");
app.use("/api", searchRoutes);

app.use("/analytics", require("./routes/analytics"));
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

// NLP Route
app.post("/generate-tags", (req, res) => {
  const content = req.body.content;

  if (!content) {
    return res.json({ tags: "", sentiment: "" });
  }

  const python = spawn("C:\\Python314\\python.exe", ["tag_generator.py", content]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (err) => {
    console.error("❌ Python error:", err.toString());
  });

  python.on("close", () => {
    console.log("✅ Python output:", result);

    const output = result.trim().split("|");

    return res.json({
      tags: output[0] || "",
      sentiment: output[1] || "Neutral"
    });
  });
});

app.post("/check-toxicity", (req, res) => {
  const content = req.body.content;

  const python = spawn("python", ["toxicity_model.py", content]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.on("close", () => {
    const output = result.trim();
    console.log("Toxicity Result:", output);

    if (output.includes("TOXIC")) {
      return res.json({
        success: false,
        message: "🚫 Toxic content detected!"
      });
    }

    return res.json({
      success: true,
      message: "✅ Safe content"
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

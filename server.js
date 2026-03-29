
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());

// health check route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("Server is alive 🚀");
});

app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "No URL provided" });
  }

  // check if yt-dlp exists first
  if (!fs.existsSync("./yt-dlp")) {
    return res.json({ error: "yt-dlp not installed yet" });
  }

  exec(`./yt-dlp -f best -g "${url}"`, (err, stdout, stderr) => {
    if (err) {
      return res.json({ error: "Failed to fetch video", details: stderr });
    }

    res.json({ download: stdout.trim() });
  });
}); // ← MISSING: This closes app.get("/download", ...)

// ← MISSING: Server startup code
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

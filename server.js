const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ status: "alive" });
});

app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  // Use system yt-dlp from Dockerfile
  exec(`yt-dlp -f best -g "${url}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("yt-dlp error:", err);
      return res.status(500).json({ error: "Failed", details: stderr });
    }
    res.json({ download: stdout.trim() });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));

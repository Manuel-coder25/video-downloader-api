const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "No URL provided" });
  }

  // Using yt-dlp to get video link
  exec(`yt-dlp -f best -g "${url}"`, (err, stdout) => {
    if (err) {
      return res.json({ error: "Failed to fetch video" });
    }

    res.json({ download: stdout.trim() });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

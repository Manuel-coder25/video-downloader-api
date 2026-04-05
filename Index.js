const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const youtubedl = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Allowed platforms (NO YOUTUBE)
const ALLOWED = [
  "tiktok.com",
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "twitter.com",
  "x.com"
];

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ALLOWED.some(domain =>
      parsed.hostname.includes(domain)
    );
  } catch {
    return false;
  }
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/download", async (req, res) => {
  const url = req.body.url;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({
      error: "Invalid or unsupported URL"
    });
  }

  const filePath = path.join(__dirname, `video_${Date.now()}.mp4`);

  try {
    await youtubedl(url, {
      output: filePath,
      format: "best"
    });

    res.download(filePath, "video.mp4", () => {
      fs.unlink(filePath, () => {});
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Download failed",
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

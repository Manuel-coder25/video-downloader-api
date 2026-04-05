const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Allowed platforms (NO YOUTUBE)
const ALLOWED = [
  "tiktok.com",
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "twitter.com",
  "x.com"
];

// ✅ Validate URL
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

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Download route (VIDEO + AUDIO)
app.post("/download", async (req, res) => {
  const { url, type } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({
      error: "Invalid or unsupported URL"
    });
  }

  const isAudio = type === "audio";

  const fileName = isAudio
    ? `audio_${Date.now()}.mp3`
    : `video_${Date.now()}.mp4`;

  const filePath = path.join(__dirname, fileName);

  try {
    if (isAudio) {
      // 🎵 AUDIO
      await ytdlp(url, {
        output: filePath,
        format: "bestaudio",
        extractAudio: true,
        audioFormat: "mp3"
      });
    } else {
      // 🎬 VIDEO
      await ytdlp(url, {
        output: filePath,
        format: "best"
      });
    }

    res.download(filePath, fileName, () => {
      fs.unlink(filePath, () => {});
    });

  } catch (err) {
    console.error("❌ Download error:", err.message);

    res.status(500).json({
      error: "Download failed",
      details: err.message
    });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

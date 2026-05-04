import express from "express";
import { getStreamToken } from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { StreamChat } from "stream-chat";

const router = express.Router();

// 🔐 TOKEN ROUTE
router.get("/token", protectRoute, getStreamToken);

// 🔥 STREAM SERVER CLIENT
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

// 🗑️ DELETE CHANNEL (FIXED + DEBUG)
router.delete("/delete-channel/:channelId", protectRoute, async (req, res) => {
  try {
    const { channelId } = req.params;

    console.log("👉 Delete request received for:", channelId);

    // create channel instance
    const channel = serverClient.channel("messaging", channelId);

    // delete channel
    await channel.delete();

    console.log("✅ Channel deleted successfully:", channelId);

    return res.status(200).json({
      success: true,
      message: "Channel deleted successfully",
    });

  } catch (error) {
    console.error("❌ Delete error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete channel",
      error: error.message,
    });
  }
});

export default router;
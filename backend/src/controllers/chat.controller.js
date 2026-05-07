import { generateStreamToken } from "../config/stream.js";
import { StreamChat } from "stream-chat";
import { ENV } from "../config/env.js";

// 🔥 SERVER CLIENT (IMPORTANT)
const serverClient = StreamChat.getInstance(
  ENV.STREAM_API_KEY,
  ENV.STREAM_API_SECRET
);

// ✅ TOKEN FUNCTION (already present)
export const getStreamToken = async (req, res) => {
  try {
    const token = generateStreamToken(req.auth().userId);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error generating Stream token:", error);
    res.status(500).json({
      message: "Failed to generate Stream token",
    });
  }
};

// 🔥 NEW: DELETE CHANNEL FUNCTION
export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    // CREATE CHANNEL INSTANCE
    const channel = serverClient.channel("messaging", channelId);

    // DELETE CHANNEL
    await channel.delete();

    res.status(200).json({
      success: true,
      message: "Channel deleted successfully",
    });

  } catch (error) {
    console.log("Error deleting channel:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete channel",
      error: error.message,
    });
  }
};
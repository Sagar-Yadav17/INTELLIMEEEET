import express from "express";
import { getStreamToken, deleteChannel } from "../controllers/chat.controller.js";
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
router.delete(
  "/delete-channel/:channelId",
  protectRoute,
  deleteChannel
);
export default router;
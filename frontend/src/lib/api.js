import { axiosInstance } from "./axios";

// 🔐 Get Stream Token
export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// 🗑️ Delete Meeting (Channel)
export async function deleteMeeting(channelId) {
  const response = await axiosInstance.delete(
    `/chat/delete-channel/${channelId}`
  );
  return response.data;
}
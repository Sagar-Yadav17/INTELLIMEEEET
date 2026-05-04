import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useStreamChat } from "../hooks/useStreamchat";
import PageLoader from "../components/PageLoader";

import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

import "../styles/stream-chat-theme.css";

import { HashIcon, PlusIcon } from "lucide-react";
import CreateChannelModal from "../components/CreateChannelModal";
import CustomChannelPreview from "../components/CustomChannelPreview";
import CustomChannelHeader from "../components/CustomChannelHeader";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { chatClient, error, isLoading } = useStreamChat();

  // ✅ SET ACTIVE CHANNEL
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  // ✅ DELETE FUNCTION (FIXED)
  const handleDeleteChannel = async (channelId) => {
  try {
    const res = await fetch(`/api/chat/delete-channel/${channelId}`, {
      method: "DELETE",
      credentials: "include", // 🔥 VERY IMPORTANT (Clerk auth)
    });

    const data = await res.json();
    console.log("Delete response:", data);

    if (res.ok) {
      alert("Deleted successfully");

      setActiveChannel(null);
      setSearchParams({});
      window.location.reload(); // force refresh

    } else {
      alert("Delete failed");
    }

  } catch (err) {
    console.error(err);
    alert("Delete error");
  }
};
  if (error) return <p>Something went wrong...</p>;
  if (isLoading || !chatClient) return <PageLoader />;

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container">

          {/* LEFT SIDEBAR */}
          <div className="str-chat__channel-list">
            <div className="team-channel-list">

              {/* HEADER */}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img src="/logo.png" alt="Logo" className="brand-logo" />
                  <span className="brand-name">Imeet</span>
                </div>
                <div className="user-button-wrapper">
                  <UserButton />
                </div>
              </div>

              {/* CHANNEL LIST */}
              <div className="team-channel-list__content">

                {/* CREATE */}
                <div className="create-channel-section">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="create-channel-btn"
                  >
                    <PlusIcon className="size-4" />
                    <span>Start Meeting</span>
                  </button>
                </div>

                <ChannelList
                  filters={{ members: { $in: [chatClient?.user?.id] } }}
                  options={{ state: true, watch: true }}

                  Preview={({ channel }) => (
                    <CustomChannelPreview
                      channel={channel}
                      activeChannel={activeChannel}
                      setActiveChannel={(channel) =>
                        setSearchParams({ channel: channel.id })
                      }
                      onDelete={handleDeleteChannel}
                    />
                  )}

                  List={({ children, loading, error }) => (
                    <div className="channel-sections">

                      {/* MEETINGS */}
                      <div className="section-header">
                        <div className="section-title">
                          <HashIcon className="size-4" />
                          <span>Meetings</span>
                        </div>
                      </div>

                      {loading && <div>Loading...</div>}
                      {error && <div>Error loading channels</div>}

                      <div className="channels-list">{children}</div>

                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* MAIN CHAT */}
          <div className="chat-main">
            <Channel channel={activeChannel}>
              <Window>
                <CustomChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>

        {isCreateModalOpen && (
          <CreateChannelModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
      </Chat>
    </div>
  );
};

export default HomePage;
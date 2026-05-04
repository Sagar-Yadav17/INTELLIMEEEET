import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

import { getStreamToken } from "../lib/api";
import socket from "../lib/socket";
import Whiteboard from "../components/Whiteboard";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const { user, isLoaded } = useUser();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const [showWhiteboard, setShowWhiteboard] = useState(false);

  useEffect(() => {
    if (!callId) return;
    socket.connect();
    socket.emit("join-room", callId);
  }, [callId]);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!user,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !user || !callId) return;

      try {
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: user.id,
            name: user.fullName,
            image: user.imageUrl,
          },
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        toast.error("Cannot connect to call");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, user, callId]);

  if (isConnecting || !isLoaded) {
    return (
      <div className="h-screen flex justify-center items-center">
        Connecting...
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent
              callId={callId}
              showWhiteboard={showWhiteboard}
              setShowWhiteboard={setShowWhiteboard}
            />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex justify-center items-center h-full">
          Failed to load call
        </div>
      )}
    </div>
  );
};

const CallContent = ({ callId, showWhiteboard, setShowWhiteboard }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <div className="flex h-screen w-full">

        {/* 🎥 VIDEO */}
        <div className={showWhiteboard ? "w-2/3 h-full" : "w-full h-full"}>
          <SpeakerLayout />

          {/* Controls + Whiteboard Button */}
          <div className="flex justify-center items-center gap-3 mt-2">
            <CallControls />

            <button
              onClick={() => setShowWhiteboard((prev) => !prev)}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg"
            >
              🖊️
            </button>
          </div>
        </div>

        {/* ✏️ WHITEBOARD */}
        {showWhiteboard && (
          <div className="w-1/3 h-full border-l bg-white">
            <Whiteboard roomId={callId} />
          </div>
        )}
      </div>
    </StreamTheme>
  );
};

export default CallPage;
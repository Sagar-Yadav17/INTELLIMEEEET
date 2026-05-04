import React from "react";
import { HashIcon } from "lucide-react";

const CustomChannelPreview = ({
    channel,
    setActiveChannel,
    activeChannel,
    onDelete,
}) => {
    const isActive = activeChannel && activeChannel.id === channel.id;
    const unreadCount = channel.countUnread();

    const handleDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("DELETE CLICKED:", channel.id); // 👈 ADD THIS
        onDelete(channel.id);
    };

    return (
        <div
            className={`flex items-center justify-between w-full px-4 py-2 rounded-lg mb-1 font-medium relative ${isActive
                    ? "bg-gray-200 border-l-4 border-purple-500"
                    : "hover:bg-blue-50"
                }`}
        >
            {/* LEFT SIDE */}
            <div
                onClick={() => setActiveChannel(channel)}
                className="flex items-center gap-2 flex-1 cursor-pointer pointer-events-auto"
            >
                <HashIcon className="w-4 h-4 text-gray-500" />
                <span className="truncate">{channel.data.id}</span>

                {unreadCount > 0 && (
                    <span className="ml-2 text-xs bg-red-500 text-white px-1 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </div>

            {/* DELETE BUTTON (FORCED CLICKABLE) */}
            <div className="relative z-50 pointer-events-auto">
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 text-sm px-2 cursor-pointer"
                >
                    ❌
                </button>
            </div>
        </div>
    );
};

export default CustomChannelPreview;
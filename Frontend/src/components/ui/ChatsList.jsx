import React, { useEffect } from "react";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";

function ChatList() {
  const {
    getChatPartners,
    isUsersLoading,
    selectedUser,
    chats,
    setSelectedUser,
  } = useChatStore();

  const {onlineUsers} = useAuthStore();

  useEffect(() => {
    getChatPartners();
  }, [getChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="flex flex-col gap-2 p-2">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
          ${
            selectedUser?._id === chat._id
              ? "bg-cyan-600/40"
              : "bg-cyan-500/10 hover:bg-cyan-500/20"
          }`}
          onClick={() => setSelectedUser(chat)}
        >
        <div className="flex items-center gap-3 relative">
  <img
    src={chat.profileImage || "/avatar.png"}
    alt="User avatar"
    className="w-12 h-12 rounded-full object-cover border border-cyan-400/30 shadow-sm"
  />

  {/* ✅ Online/Offline Dot */}
  <span
    className={`absolute left-9 bottom-0 block size-3 rounded-full border-2 border-slate-900 ${
      onlineUsers.includes(chat._id) ? "bg-green-500" : "bg-gray-400"
    }`}
  ></span>

  <div className="flex flex-col ml-1">
    <p className="text-white font-medium text-sm md:text-base">
      {chat.username}
    </p>
  </div>
</div>

        </div>
      ))}
    </div>
  );
}

export default ChatList;

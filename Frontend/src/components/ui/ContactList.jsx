import React, { useEffect } from "react";
import { useChatStore } from "../../../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../../../store/useAuthStore";

function ContactList() {
  const {
    getAllContacts,
    isUsersLoading,
    selectedUser,
    allContacts,
    setSelectedUser,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="flex flex-col gap-2 p-2">
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors relative
          ${
            selectedUser?._id === contact._id
              ? "bg-cyan-600/40"
              : "bg-cyan-500/10 hover:bg-cyan-500/20"
          }`}
          onClick={() => setSelectedUser(contact)}
        >
          {/* Avatar container with relative positioning */}
          <div className="relative">
            <img
              src={contact.profileImage || "/avatar.png"}
              alt="User avatar"
              className="w-12 h-12 rounded-full object-cover border border-cyan-400/30 shadow-sm"
            />

            {/* ✅ Online/Offline Dot */}
            <span
              className={`absolute bottom-0 right-0 block size-3 rounded-full border-2 border-slate-900 ${
                onlineUsers.includes(contact._id) ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>

          {/* Username + subtitle */}
          <div className="flex flex-col">
            <p className="text-white font-medium text-sm md:text-base">
              {contact.username}
            </p>
            <p className="text-gray-400 text-xs">Tap to chat</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;

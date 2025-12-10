import { useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch messages when selected user changes
  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return ()=> unsubscribeFromMessages; 
  }, [selectedUser, getMessagesByUserId,subscribeToMessages,unsubscribeFromMessages]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader />

      {/* Chat messages */}
      <div className="flex-1 px-6 overflow-y-auto py-6 bg-slate-950">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => {
              const isSender = msg.sender === authUser._id;
             // console.log("isSender:",isSender);
              return (
                <div
                  key={msg._id}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl shadow-md text-sm ${
                      isSender
                        ? "bg-cyan-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-lg mb-2 max-h-48 object-cover"
                      />
                    )}
                    {msg.text && <p>{msg.text}</p>}
                    <p className="text-xs mt-1 opacity-60 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.username || "User"} />
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-800">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatContainer;

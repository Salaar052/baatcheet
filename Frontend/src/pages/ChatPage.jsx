import { useChatStore } from "../../store/useChatStore";

import ProfileHeader from "../components/ui/ProfileHeader";
import ActiveTabSwitch from "../components/ui/ActiveTabSwitch";
import ChatsList from "../components/ui/ChatsList";
import ContactList from "../components/ui/ContactList";
import ChatContainer from "../components/ui/ChatContainer";
import NoConversationPlaceholder from "../components/ui/NoConversationPlaceholder";
import { useAuthStore } from "../../store/useAuthStore";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    
    <div className="relative w-full max-w-6xl h-[800px] flex rounded-xl overflow-hidden shadow-lg">
      {/* LEFT SIDE */}
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col border-r border-slate-700/40">
        <ProfileHeader />
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;
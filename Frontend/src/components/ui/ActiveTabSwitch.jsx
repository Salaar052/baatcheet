import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChatStore } from "../../../store/useChatStore";
import { MessageCircle, Users } from "lucide-react";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 rounded-lg bg-slate-800/70">
        <TabsTrigger
          value="chats"
          className="flex items-center gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-300"
        >
          <MessageCircle className="h-4 w-4" />
          Chats
        </TabsTrigger>

        <TabsTrigger
          value="contacts"
          className="flex items-center gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-300"
        >
          <Users className="h-4 w-4" />
          Contacts
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default ActiveTabSwitch;

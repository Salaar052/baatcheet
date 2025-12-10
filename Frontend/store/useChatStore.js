import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  chats: [],
  allContacts: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  // 🔊 Sound toggle
  toggleSound: () =>
    set((state) => {
      const next = !state.isSoundEnabled;
      localStorage.setItem("isSoundEnabled", next.toString());
      return { isSoundEnabled: next };
    }),

  // Tabs & selection
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  // 📇 Contacts
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/message/contacts");
      set({ allContacts: data });
      if (import.meta.env.DEV) console.log("contacts", data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // 💬 Chat partners
  getChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/message/chats");
      set({ chats: data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // 📩 Messages
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true, messages: [] });
    
    try {
      const { data } = await axiosInstance.get(`/message/${userId}`);
      set({ messages: data });
    } catch (error) {
      //toast.error("Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ✉️ Send message (with optimistic UI)
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      sender: authUser._id,
      receiver: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    // add optimistic
    set({ messages: [...messages, optimisticMessage] });

    try {
      const { data } = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );

      // replace optimistic with actual
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? data : msg
        ),
      }));
    } catch (error) {
      // rollback: remove optimistic
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: (newMessage)=>{
    const {isSoundEnabled,selectedUser} = get();
    if(!selectedUser)return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage",(newMessage)=>{
      const currentMessages = get().messages;
      set({messages:[...currentMessages,newMessage]});

      if(isSoundEnabled){
        const notificationSound =new Audio("sounds/notification.mp3");  
        notificationSound.currentTime=0;
        notificationSound.play().catch((e)=> console.log("audio play failed",e));
      }
    })
  }, 

  unsubscribeFromMessages:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  }, 

}));

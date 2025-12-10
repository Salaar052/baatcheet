import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../src/lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BaseURL = "http://localhost:3000"

const useAuthStore = create(
  persist(
    (set,get) => ({
      authUser: null,
      isCheckingAuth: true,
      isSigningUp: false,
      isLoggingIn: false,
      socket:null,
      onlineUsers:[],

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data.user });
          get().connectSocket();
        } catch (error) {
          console.error("Error in check auth", error);
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Signup Successful");
          get().connectSocket();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Error in signup");
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Login Successful");
          get().connectSocket();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Error in Login");
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logout Successful");
          get().disconnectSocket();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Error in Logout");
        }
      },

      updateProfile: async (data) => {
        try {
          const res = await axiosInstance.put("/auth/updateProfileImage", data);
          toast.success("Profile updated successfully");
          return res.data;
        } catch (error) {
          toast.error(error?.response?.data?.message || "Error in updating profile");
          throw error;
        }
      },

      connectSocket: () =>{
        const {authUser} = get();
        if(!authUser||get().socket?.connected) return;

        const socket = io(BaseURL,{
          withCredentials:true,
        })

        socket.connect();
        set({socket});

        socket.on("getOnlineUsers",(userIds)=>{
          set({onlineUsers:userIds});
        });
      },

      disconnectSocket: ()=>{
        if(get().socket?.connected)
          get().socket.disconnect();
      }


    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({ authUser: state.authUser }), // only save user
    }
  )
);



export { useAuthStore };

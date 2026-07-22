import { create } from 'zustand'

export const useMessageStore = create((set) => ({
  messages: [],
  isLoading: false,
  artifacts: [],
  setMessages: (messages) => set({ messages: messages || [] }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setArtifacts: (artifacts) => set({ artifacts: artifacts || [] }),
}))

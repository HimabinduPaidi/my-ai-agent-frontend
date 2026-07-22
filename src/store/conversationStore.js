import { create } from 'zustand'

export const useConversationStore = create((set) => ({
  conversations: [],
  selectedConversation: null,
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => ({ conversations: [conversation, ...state.conversations] })),
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  setConvTitle: ({ conversationId, title }) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, title } : conv
      ),
      selectedConversation:
        state.selectedConversation?._id === conversationId
          ? { ...state.selectedConversation, title }
          : state.selectedConversation,
    })),
}))

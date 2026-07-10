import { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Square,
  Zap,
  MessageSquare,
  Code2,
  Presentation,
  Image as ImageIcon,
  Globe,
  FileText,
  X,
  Mic,
  MicOff,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/message.slice";
import { sendPrompt } from "../features/agent.api";
import { createConversation, updateConversations } from "../features/conversation.api";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversation.slice";
import Button from "./ui/Button";
import { APP_NAME } from "../config/brand";

export default function ChatInput({ setBanner }) {
  const [selectedAgent, setSelectedAgent] = useState("auto");
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { isLoading } = useSelector((state) => state.message);
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const placeholders = {
    auto: `Ask ${APP_NAME} anything…`,
    chat: `Chat with ${APP_NAME}…`,
    coding: "Describe the software you want…",
    pdf: "Generate a PDF about…",
    ppt: "Create a presentation about…",
    image: "Describe the image…",
    search: "Search the web…",
  };

  const agents = [
    { id: "auto", icon: Zap, label: "Auto" },
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "coding", icon: Code2, label: "Coding" },
    { id: "pdf", icon: FileText, label: "PDF" },
    { id: "ppt", icon: Presentation, label: "PPT" },
    { id: "image", icon: ImageIcon, label: "Image" },
    { id: "search", icon: Globe, label: "Search" },
  ];

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    const prompt = value.trim();
    if (!prompt) return;

    dispatch(setIsLoading(true));

    try {
      let conversation = selectedConversation;

      if (!conversation) {
        const newConversation = await createConversation();
        dispatch(addConversation(newConversation));
        dispatch(setSelectedConversation(newConversation));
        conversation = newConversation;
      }

      if (conversation.title === "New Chat") {
        await updateConversations(conversation._id, prompt.slice(0, 40));
        dispatch(
          setConvTitle({
            conversationId: conversation._id,
            title: prompt.slice(0, 40),
          })
        );
      }

      dispatch(addMessage({ role: "user", content: prompt }));
      setValue("");

      const formData = new FormData();
      formData.append("conversationId", conversation._id);
      formData.append("prompt", prompt);
      formData.append("agent", selectedAgent);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      setSelectedFile(null);

      const data = await sendPrompt(formData);
      dispatch(
        addMessage({
          role: "assistant",
          content: data.answer,
          images: data.images,
        })
      );

      if (data.artifacts) {
        dispatch(setArtifacts(data.artifacts));
      }
    } catch (error) {
      setBanner({
        open: true,
        title: error.response?.data?.title || "Something went wrong",
        message: error.response?.data?.message || "Please try again.",
      });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) handleSend();
    }
  };

  return (
    <div className="w-full px-3 md:px-6 py-4 border-t border-border bg-surface shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-3 bg-surface border border-border rounded-xl shadow-[var(--shadow-card)] px-4 pt-3 pb-3 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200">
          <div className="flex gap-1.5 flex-wrap">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isActive = selectedAgent === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                    text-xs font-medium border transition-all duration-200 cursor-pointer
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                    ${
                      isActive
                        ? "bg-primary text-white border-primary"
                        : "bg-background text-text-secondary border-border hover:text-text-primary hover:border-border"
                    }
                  `}
                >
                  <Icon size={13} strokeWidth={2} />
                  {agent.label}
                </button>
              );
            })}
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 w-fit">
              {selectedFile.type === "application/pdf" ? (
                <FileText size={16} className="text-danger shrink-0" />
              ) : (
                selectedFile?.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt=""
                    className="h-8 w-8 rounded-md object-cover shrink-0"
                  />
                )
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary truncate max-w-[180px]">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-text-muted">
                  {Math.ceil(selectedFile.size / 1024)} KB
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  fileRef.current.value = "";
                }}
                className="ml-1 p-1 rounded-md hover:bg-surface transition-colors cursor-pointer"
                aria-label="Remove file"
              >
                <X size={14} className="text-text-muted hover:text-text-primary" />
              </button>
            </div>
          )}

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[selectedAgent]}
            rows={2}
            disabled={isLoading}
            aria-label="Message input"
            className="
              w-full bg-transparent outline-none resize-none
              text-sm text-text-primary placeholder:text-text-muted
              leading-relaxed min-h-[52px] max-h-[200px]
              disabled:opacity-50 scrollbar-thin
            "
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <input
                ref={fileRef}
                type="file"
                hidden
                accept=".pdf,image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setSelectedFile(file);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileRef.current.click()}
                aria-label="Attach file"
              >
                <Paperclip size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMic}
                aria-label={isListening ? "Stop recording" : "Start voice input"}
                className={
                  isListening
                    ? "bg-danger/10 text-danger hover:bg-danger/15 hover:text-danger"
                    : ""
                }
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </Button>
            </div>

            <Button
              onClick={handleSend}
              disabled={!isLoading && !value.trim()}
              size="iconLg"
              variant={isLoading ? "secondary" : value.trim() ? "primary" : "ghost"}
              aria-label={isLoading ? "Stop" : "Send message"}
            >
              {isLoading ? (
                <Square size={12} fill="currentColor" />
              ) : (
                <Send size={15} />
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-[11px] text-text-muted mt-2.5">
          {APP_NAME} can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}

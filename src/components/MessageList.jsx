import MessageBubble from "./MessageBubble";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { TypingIndicator } from "./ui/Loader";
import Badge from "./ui/Badge";
import {
  Sparkles,
  Code2,
  FileText,
  Globe,
  Image as ImageIcon,
  Presentation,
  Server,
  Zap,
} from "lucide-react";
import { APP_NAME, APP_ARCHITECTURE, APP_TAGLINE } from "../config/brand";

const CAPABILITIES = [
  {
    icon: Zap,
    label: "Auto routing",
    description: "Picks the right service for your request",
  },
  {
    icon: Code2,
    label: "Code generation",
    description: "Build apps with live preview",
  },
  {
    icon: FileText,
    label: "PDF & documents",
    description: "Generate structured reports",
  },
  {
    icon: Presentation,
    label: "Presentations",
    description: "Create slide decks from prompts",
  },
  {
    icon: ImageIcon,
    label: "Image creation",
    description: "Visual content on demand",
  },
  {
    icon: Globe,
    label: "Web search",
    description: "Real-time information retrieval",
  },
];

export default function MessageList() {
  const bottomRef = useRef(null);
  const { messages, isLoading } = useSelector((state) => state.message);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (selectedConversation?.title === "New Chat") return;
    const get = async () => {
      const data = await getMessages(selectedConversation?._id);
      dispatch(setMessages(data));
      const latestArtifactMessage = [...data]
        .reverse()
        .find((msg) => msg.artifacts && msg.artifacts.length > 0);

      if (latestArtifactMessage) {
        dispatch(setArtifacts(latestArtifactMessage.artifacts));
      }
    };
    get();
  }, [selectedConversation?._id]);

  const firstName = userData?.name?.split(" ")[0];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scrollbar-thin">
      {messages.length === 0 && !isLoading ? (
        <div className="h-full flex flex-col items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-2xl flex flex-col items-center text-center gap-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                <Sparkles size={22} className="text-primary" strokeWidth={1.75} />
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold text-text-primary tracking-tight">
                  {firstName ? `Hello, ${firstName}` : `Welcome to ${APP_NAME}`}
                </h1>
                <p className="text-[14px] text-text-secondary leading-relaxed max-w-md">
                  {APP_TAGLINE}
                </p>
              </div>

              <Badge variant="accent" className="inline-flex items-center gap-1.5 px-2.5 py-1">
                <Server size={12} />
                Microservice architecture
              </Badge>
            </div>

            <p className="text-[13px] text-text-muted leading-relaxed max-w-lg px-2">
              {APP_ARCHITECTURE}
            </p>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {CAPABILITIES.map(({ icon: Icon, label, description }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04, ease: "easeOut" }}
                  className="
                    flex items-start gap-3 text-left p-4 rounded-xl
                    bg-surface border border-border shadow-[var(--shadow-card)]
                    hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200
                  "
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background border border-border shrink-0">
                    <Icon size={15} className="text-text-secondary" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-text-primary">{label}</p>
                    <p className="text-[12px] text-text-muted mt-0.5 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-[12px] text-text-muted mt-2">
              Type a message below or pick an agent to get started.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <MessageBubble
                role={msg.role}
                content={msg.content}
                images={msg?.images || []}
              />
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

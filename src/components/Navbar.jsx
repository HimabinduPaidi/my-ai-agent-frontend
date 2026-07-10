import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import Badge from "./ui/Badge";

export default function Navbar() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  return (
    <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-surface/80 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-3 min-w-0 pl-10 lg:pl-0">
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-primary/8 border border-primary/12 shrink-0">
          <MessageSquare size={14} className="text-primary" strokeWidth={2} />
        </div>
        <div className="flex items-center gap-2.5 min-w-0">
          <h2 className="text-sm font-semibold text-text-primary tracking-tight truncate">
            {selectedConversation?.title || "New conversation"}
          </h2>
          {messages.length > 0 && (
            <Badge variant="default" className="hidden sm:inline-flex shrink-0">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}

import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  LogOut,
  PenSquare,
  Menu,
  X,
  Coins,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import { getConversations } from "../features/conversation.api";
import { setConversations, setSelectedConversation } from "../redux/conversation.slice";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
import BillingDrawer from "./BillingDrawer";
import Button from "./ui/Button";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";
import SectionTitle from "./ui/SectionTitle";
import EmptyState from "./ui/EmptyState";
import { APP_NAME, APP_INITIAL } from "../config/brand";

export default function Sidebar() {
  const [hovered, setHovered] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const dispatch = useDispatch();
  const [showBilling, setShowBilling] = useState(false);

  const logout = async () => {
    try {
      await api.get("/api/auth/logout");
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [userData?._id]);

  const handleCreateConversation = () => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));
    setMobileOpen(false);
  };

  const handleSelectConversation = async (conversation) => {
    setMobileOpen(false);
    dispatch(setSelectedConversation(conversation));
    const messages = await getMessages(conversation._id);
    dispatch(setMessages(messages));
    dispatch(setArtifacts(messages.artifacts));
  };

  const CollapsedRail = () => (
    <div className="hidden lg:flex flex-col items-center w-14 h-screen bg-surface border-r border-border py-4 gap-1 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(false)}
        aria-label="Expand sidebar"
        className="mb-1"
      >
        <PanelLeft size={16} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleCreateConversation}
        aria-label="New chat"
      >
        <Plus size={16} />
      </Button>

      <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto w-full px-2 scrollbar-thin mt-2">
        {conversations.map((chat) => {
          const isActive = selectedConversation?._id === chat._id;
          return (
            <button
              key={chat._id}
              onClick={() => handleSelectConversation(chat)}
              title={chat.title}
              aria-label={chat.title}
              className={`
                flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 border-none cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-transparent text-text-muted hover:bg-background hover:text-text-secondary"
                }
              `}
            >
              <MessageSquare size={15} />
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-2">
        {userData && (
          <Avatar src={userData.avatar} alt={userData.name} size="sm" showStatus />
        )}
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(true)}
          className="hidden lg:flex"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={16} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </Button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xs">{APP_INITIAL}</span>
          </div>
          <span className="text-[15px] font-semibold text-text-primary tracking-tight truncate">
            {APP_NAME}
          </span>
        </div>

        {userData && (
          <Badge variant="primary" className="shrink-0 capitalize">
            {userData.plan ?? "pro"}
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleCreateConversation}
          aria-label="New chat"
        >
          <PenSquare size={14} />
        </Button>
      </div>

      <div className="px-3 pt-4 pb-2">
        <Button
          variant="primary"
          size="md"
          onClick={handleCreateConversation}
          className="w-full"
        >
          <Plus size={15} />
          New Chat
        </Button>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Start a new chat to begin your first conversation."
          actionLabel="Start chatting"
          onAction={handleCreateConversation}
          className="flex-1"
        />
      ) : (
        <>
          <SectionTitle>Recent</SectionTitle>
          <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
            {conversations.map((chat) => {
              const isActive = selectedConversation?._id === chat._id;
              const isHov = hovered === chat._id;
              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectConversation(chat)}
                  onMouseEnter={() => setHovered(chat._id)}
                  onMouseLeave={() => setHovered(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelectConversation(chat);
                    }
                  }}
                  className={`
                    flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-lg border transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                    ${
                      isActive
                        ? "bg-primary/6 border-primary/15"
                        : isHov
                          ? "bg-background border-transparent"
                          : "bg-transparent border-transparent"
                    }
                  `}
                >
                  <div
                    className={`
                      flex items-center justify-center shrink-0 w-7 h-7 rounded-md transition-colors duration-200
                      ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-background text-text-muted"
                      }
                    `}
                  >
                    <MessageSquare size={13} />
                  </div>
                  <p
                    className={`text-[13px] font-medium truncate ${
                      isActive ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {chat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mx-3 h-px bg-border" />

      <div className="px-3 py-3">
        {userData ? (
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-background transition-colors duration-200">
            <Avatar
              src={userData.avatar}
              alt={userData.name}
              size="md"
              showStatus
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text-primary truncate">
                {userData.name}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5 capitalize">
                {userData.plan || "Free"} plan
              </p>
            </div>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBilling(true)}
                aria-label="Billing and credits"
                className="text-text-muted hover:text-accent"
              >
                <Coins size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Log out"
                className="text-text-muted"
              >
                <LogOut size={14} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (collapsed) return <CollapsedRail />;

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 shadow-sm"
        aria-label="Open menu"
      >
        <Menu size={16} />
      </Button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-secondary/30 backdrop-blur-[2px]"
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[272px] h-screen shrink-0
          border-r border-border
          transition-transform duration-200 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <SidebarContent />
      </aside>

      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </>
  );
}

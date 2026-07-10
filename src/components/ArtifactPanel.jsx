import { useState } from "react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { detectLanguage } from "../utils/detectLanguage";
import {
  Code2,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";

export default function ArtifactPanel() {
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { artifacts } = useSelector((state) => state.message);
  const artifact = artifacts?.[0];

  if (!artifact) return null;

  const file = artifact?.files?.[activeFile];
  const htmlFile = artifact?.files?.find((f) => f.name === "index.html");
  const cssFile = artifact?.files?.find((f) => f.name === "style.css");
  const jsFile = artifact?.files?.find((f) => f.name === "script.js");
  const canPreview = Boolean(htmlFile);

  const previewDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>${cssFile?.content || ""}</style>
</head>
<body>
${htmlFile?.content || ""}
<script>${jsFile?.content || ""}<\/script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(file?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PanelContent = ({ onClose }) => (
    <div className="flex flex-col h-full bg-surface">
      <div className="h-14 px-4 border-b border-border flex items-center gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose ?? (() => setCollapsed(true))}
          aria-label={onClose ? "Close panel" : "Collapse panel"}
        >
          {onClose ? <X size={15} /> : <PanelRightClose size={15} />}
        </Button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/8 border border-primary/12 shrink-0">
            <Code2 size={13} className="text-primary" />
          </div>
          <h2 className="text-[13px] font-medium text-text-primary truncate">
            {artifact.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {tab === "code" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-xs h-8"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy
                </>
              )}
            </Button>
          )}

          {canPreview && (
            <div className="flex items-center gap-0.5 bg-background border border-border p-0.5 rounded-lg">
              <button
                onClick={() => setTab("code")}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 cursor-pointer
                  ${
                    tab === "code"
                      ? "bg-surface text-text-primary shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }
                `}
              >
                <Code2 size={11} /> Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 cursor-pointer
                  ${
                    tab === "preview"
                      ? "bg-surface text-text-primary shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }
                `}
              >
                <Eye size={11} /> Preview
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {tab === "code" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex border-b border-border overflow-x-auto scrollbar-thin shrink-0"
          >
            {artifact.files?.map((f, index) => (
              <button
                key={f.name}
                onClick={() => setActiveFile(index)}
                className={`
                  px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-200
                  border-r border-border relative cursor-pointer bg-transparent
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary
                  ${
                    activeFile === index
                      ? "text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }
                `}
              >
                {f.name}
                {activeFile === index && (
                  <motion.div
                    layoutId="filetab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          {tab === "preview" && canPreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full"
            >
              <iframe
                title="preview"
                sandbox="allow-scripts"
                srcDoc={previewDoc}
                className="w-full h-full bg-white"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`code-${activeFile}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full"
            >
              <Editor
                theme="vs"
                language={detectLanguage(file?.name || "")}
                value={file?.content || ""}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  lineNumbers: "on",
                  renderLineHighlight: "none",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <Button
        onClick={() => setMobileOpen(true)}
        variant="primary"
        size="sm"
        className="lg:hidden fixed bottom-24 right-4 z-40 shadow-[var(--shadow-card-hover)]"
      >
        <Code2 size={14} />
        View Code
      </Button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-secondary/30 backdrop-blur-[2px]"
            />
            <motion.div
              key="mob-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[92vw] max-w-[420px] border-l border-border overflow-hidden shadow-[var(--shadow-modal)]"
            >
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div
            key="open"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "clamp(320px, 38%, 640px)", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="hidden lg:flex h-full border-l border-border flex-col overflow-hidden shrink-0"
          >
            <PanelContent />
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 48, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="hidden lg:flex h-full border-l border-border bg-surface flex-col items-center py-4 gap-3 shrink-0"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(false)}
              aria-label="Expand code panel"
            >
              <PanelRightOpen size={15} />
            </Button>
            <div className="flex-1 flex items-center justify-center">
              <p
                className="text-[10px] font-medium text-text-muted tracking-widest uppercase whitespace-nowrap"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {artifact.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

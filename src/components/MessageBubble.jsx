import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, X, ExternalLink, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MessageBubble({ role, content, images }) {
  const isUser = role === "user";
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const markdown = (content || "")
    .replace(/```review/gi, "```")
    .replace(/```text/gi, "```")
    .replace(/```[a-zA-Z0-9_-]+\s+id="[^"]*"/g, "```");

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`
          flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5
          ${isUser ? "bg-primary/10 border border-primary/15" : "bg-background border border-border"}
        `}
        aria-hidden="true"
      >
        {isUser ? (
          <User size={14} className="text-primary" />
        ) : (
          <Bot size={14} className="text-text-secondary" />
        )}
      </div>

      <div
        className={`
          min-w-0 max-w-[calc(100%-48px)] md:max-w-[75%]
          ${isUser ? "items-end" : "items-start"}
        `}
      >
        <div
          className={`
            px-4 py-3 rounded-xl break-words overflow-hidden leading-relaxed
            ${
              isUser
                ? "bg-primary text-white rounded-tr-md"
                : "bg-surface border border-border text-text-primary rounded-tl-md shadow-[var(--shadow-card)]"
            }
          `}
        >
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  loading="lazy"
                  alt=""
                  onClick={() => setLightboxSrc(img)}
                  onError={(e) => e.currentTarget.remove()}
                  className="w-36 h-24 rounded-lg object-cover border border-border cursor-zoom-in hover:opacity-90 transition-opacity duration-200"
                />
              ))}
            </div>
          )}

          <div
            className={`prose-chat text-[14px] ${isUser ? "text-white [&_a]:text-white/90" : "text-text-primary"}`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg font-semibold mt-4 mb-2 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mt-4 mb-2 first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mt-3 mb-1.5 first:mt-0">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-2.5 last:mb-0 whitespace-pre-wrap break-words leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-border pl-3 my-2 text-text-secondary italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded-lg border border-border">
                    <table className="min-w-full text-sm">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border-b border-border bg-background px-3 py-2 text-left text-xs font-semibold text-text-secondary">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-b border-border px-3 py-2 text-text-primary">
                    {children}
                  </td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-2 inline-flex items-center gap-1 hover:text-primary-hover transition-colors"
                  >
                    {children}
                    <ExternalLink size={11} />
                  </a>
                ),
                img: ({ src }) => {
                  if (!src) return null;
                  return (
                    <img
                      src={src}
                      loading="lazy"
                      alt=""
                      onClick={() => setLightboxSrc(src)}
                      onError={(e) => e.currentTarget.remove()}
                      className="w-36 h-24 rounded-lg object-cover border border-border cursor-zoom-in my-2"
                    />
                  );
                },
                code({ className, children }) {
                  const value = String(children)
                    .replace(/^\s*```[^\n]*\n/, "")
                    .replace(/\n```\s*$/, "")
                    .trim();

                  if (!className) {
                    return (
                      <code
                        className={`px-1.5 py-0.5 rounded-md text-[13px] font-mono ${
                          isUser
                            ? "bg-white/15 text-white"
                            : "bg-background text-accent border border-border"
                        }`}
                      >
                        {value}
                      </code>
                    );
                  }

                  const language = className.replace("language-", "");

                  return (
                    <div className="my-3 overflow-hidden rounded-lg border border-border bg-background">
                      <div className="flex items-center justify-between border-b border-border px-3 py-2">
                        <span className="uppercase text-[10px] font-medium tracking-wider text-text-muted">
                          {language}
                        </span>
                        <button
                          onClick={() => copyCode(value)}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                          aria-label="Copy code"
                        >
                          {copiedCode === value ? (
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
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language={language}
                        style={oneLight}
                        wrapLongLines
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          padding: "14px 16px",
                          background: "#f8fafc",
                          fontSize: "12.5px",
                          lineHeight: "1.6",
                        }}
                      >
                        {value}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-secondary/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-lg p-2 transition-colors cursor-pointer"
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>
            <img
              src={lightboxSrc}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90vw] max-h-[85vh] rounded-xl border border-border shadow-[var(--shadow-modal)] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MessageBubble;

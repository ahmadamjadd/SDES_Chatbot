import { Message } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.min.css";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex w-full min-w-0 gap-4 px-1 py-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xl">
          🦊
        </div>
      )}
      <div
        className={`rounded-2xl px-6 py-4 overflow-visible break-words ${
          isUser
            ? "max-w-[60%] bg-user-message text-user-message-foreground rounded-br-md"
            : "max-w-[88%] min-w-0 bg-ai-message text-ai-message-foreground"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-lg leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-lg dark:prose-invert max-w-none min-w-0 text-lg leading-relaxed break-words  prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-blockquote:text-foreground/90 prose-th:text-foreground prose-td:text-foreground prose-a:text-primary [&_*]:break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p({ children }) {
                  return <p className="mb-4 leading-relaxed">{children}</p>;
                },
                h1({ children }) {
                  return <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-lg font-bold mb-3 mt-4 first:mt-0">{children}</h3>;
                },
                h4({ children }) {
                  return <h4 className="font-bold mb-2 mt-3 first:mt-0">{children}</h4>;
                },
                h5({ children }) {
                  return <h5 className="font-semibold mb-2 mt-2 first:mt-0">{children}</h5>;
                },
                h6({ children }) {
                  return <h6 className="font-semibold text-sm mb-2 mt-2 first:mt-0">{children}</h6>;
                },
                br() {
                  return <br className="mb-2" />;
                },
                ul({ children }) {
                  return <ul className="list-disc list-outside mb-4 space-y-1.5 pl-6 [&>li]:pl-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal list-outside mb-4 space-y-1.5 pl-6 [&>li]:pl-1">{children}</ol>;
                },
                li({ children }) {
                  return <li className="leading-relaxed [&>ul]:mt-2 [&>ol]:mt-2">{children}</li>;
                },
                blockquote({ children }) {
                  return <blockquote className="border-l-4 border-primary/50 pl-4 py-2 mb-4 italic text-foreground/90 bg-muted/30 rounded">{children}</blockquote>;
                },
                strong({ children }) {
                  return <strong className="font-bold">{children}</strong>;
                },
                em({ children }) {
                  return <em className="italic">{children}</em>;
                },
                del({ children }) {
                  return <del className="line-through text-muted-foreground">{children}</del>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {children}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  );
                },
                img({ src, alt }) {
                  return (
                    <img
                      src={src}
                      alt={alt}
                      className="max-w-full h-auto rounded-lg my-4 border border-border"
                    />
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table className="border-collapse border border-border text-sm">
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return <thead className="bg-muted">{children}</thead>;
                },
                tbody({ children }) {
                  return <tbody>{children}</tbody>;
                },
                tr({ children }) {
                  return <tr className="border border-border">{children}</tr>;
                },
                th({ children }) {
                  return <th className="border border-border px-3 py-2 text-left font-semibold">{children}</th>;
                },
                td({ children }) {
                  return <td className="border border-border px-3 py-2">{children}</td>;
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match && !String(children).includes("\n");
                  if (isInline) {
                    return (
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock language={match?.[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>;
                },
                hr() {
                  return <hr className="my-6 border-border" />;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
          A
        </div>
      )}
    </motion.div>
  );
};

function CodeBlock({ children, language }: { children: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = (() => {
    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(children, { language }).value;
      }
      return hljs.highlightAuto(children).value;
    } catch {
      return children;
    }
  })();

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-muted px-4 py-2 text-sm text-muted-foreground">
        <span>{language || "code"}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-foreground transition-colors">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
}

export default ChatMessage;

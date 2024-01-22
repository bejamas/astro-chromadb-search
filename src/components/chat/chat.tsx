import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { marked } from "marked";
import clsx from "clsx";
import styles from "./chat.module.scss";

export function ChatContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);

  const addMessage = (content: string, type: "Human" | "AI") => {
    setHistory((history) => [...history, { content, type }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) {
      return null;
    }

    setQuestion("");
    addMessage(question, "Human");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/chat`, {
        method: "POST",
        body: JSON.stringify({
          question,
          history,
        }),
      });

      if (!res.ok) {
        return null;
      }

      const { result } = await res.json();

      addMessage(result, "AI");
    } catch (err) {}

    setIsLoading(false);
  };

  return (
    <main className="flex-1 container mx-auto max-w-3xl flex flex-col">
      <div className="flex flex-col gap-7 mb-52">
        {history.map((message, index) => {
          return (
            <div
              key={index}
              className={clsx(
                "chat",
                message.type === "Human" ? "chat-end" : "chat-start"
              )}
            >
              <div
                className={clsx(styles.message, "chat-bubble")}
                dangerouslySetInnerHTML={{ __html: marked(message.content) }}
              />
            </div>
          );
        })}
      </div>

      <div className="fixed left-0 bottom-0 w-full bg-neutral shadow-md border-t border-neutral-500">
        <form
          onSubmit={handleSubmit}
          className="container max-w-3xl mx-auto flex gap-3 pt-7 pb-10"
        >
          <input
            type="text"
            value={question}
            className="input input-bordered w-full border-neutral-600"
            disabled={isLoading}
            placeholder="Type your question here..."
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            disabled={isLoading}
            className="btn btn-ghost border border-neutral-600"
          >
            {isLoading ? (
              <span className="loading" />
            ) : (
              <FontAwesomeIcon icon={faArrowUp} />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

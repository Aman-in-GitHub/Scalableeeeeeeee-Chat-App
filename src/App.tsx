import React, { useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketProvider";

export default function App() {
  const [message, setMessage] = React.useState("");
  const { socket, messages, sendMessage, activeUsers } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function handleSubmit() {
    if (message.trim() === "") return;
    sendMessage(message);
    setMessage("");
  }

  return (
    <main className="font-mono h-screen max-h-screen relative overflow-hidden">
      {!socket ? (
        <section className="flex h-screen items-center justify-center">
          <h2 className="text-3xl lg:text-5xl text-center font-black animate-spin">
            Connecting...
          </h2>
        </section>
      ) : (
        <section className="flex flex-col h-screen">
          <span className="text-xs absolute right-2 top-2 select-none">
            {activeUsers > 1
              ? `${activeUsers} users online`
              : `Only you are online`}
          </span>

          <div className="flex flex-col space-y-4 overflow-y-auto flex-grow px-4 pt-4 pb-16">
            {messages.map((message) => {
              return (
                <div key={message.id}>
                  {message.type === "event" ? (
                    <p className="text-sm text-center">
                      {message?.status === "enter"
                        ? `${message.user.slice(0, 10)} has joined the chat`
                        : `${message.user.slice(0, 10)} has left the chat`}
                    </p>
                  ) : message.type === "message" ? (
                    <p className="text-lg">
                      <span className="font-bold">
                        {message.user === socket?.id
                          ? "You"
                          : message.user.slice(0, 10)}
                      </span>
                      : {message.message}
                      <br />
                      <span className="text-xs">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </p>
                  ) : null}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full absolute bottom-0 bg-white"
          >
            <input
              type="text"
              placeholder={"Type your message..."}
              value={message}
              className="w-full rounded-none border-0 border-t text-3xl py-3 px-4"
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
        </section>
      )}
    </main>
  );
}

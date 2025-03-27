import React from "react";
import { useSocket } from "@/context/SocketProvider";

function App() {
  const { socket, messages, sendMessage } = useSocket();
  const [message, setMessage] = React.useState("");

  function handleSubmit() {
    sendMessage(message);
    setMessage("");
  }

  return (
    <main className="font-mono">
      <h1>Scalableeeeeeeee Chat App</h1>

      <div>
        {messages.map((message) => {
          return (
            <div key={message.id}>
              <p>
                {message.user === socket?.id ? "You" : message.user} -{" "}
                {message.message}
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <input
          type="text"
          value={message}
          className="border"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </main>
  );
}

export default App;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { SocketProvider } from "@/context/SocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <App />
      <Toaster richColors={true} position="top-right" />
    </SocketProvider>
  </StrictMode>,
);

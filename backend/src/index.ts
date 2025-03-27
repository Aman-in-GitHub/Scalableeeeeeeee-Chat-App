import { createServer } from "http";
import { io } from "@/lib/socket";

const PORT = process.env.PORT || 4444;
const httpServer = createServer();

io.attach(httpServer);

httpServer.listen(PORT, () => {
  console.log(`http:// Server running on port ${PORT}`);
});

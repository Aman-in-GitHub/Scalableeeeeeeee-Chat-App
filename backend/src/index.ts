import { createServer } from "http";
import { io, setUpSubscriptions } from "@/lib/socket";
import { startConsumer } from "@/lib/kafka.ts";

const PORT = process.env.PORT || 4444;
const httpServer = createServer();

async function init() {
  await startConsumer("MESSAGES", "scalableeeeeeeee-messages-consumer");
  await startConsumer("EVENTS", "scalableeeeeeeee-events-consumer");

  io.attach(httpServer);

  await setUpSubscriptions();

  httpServer.listen(PORT, () => {
    console.log(`http Server running on port ${PORT}`);
  });
}

init();

import { createClient } from "redis";

export const pub = createClient();
export const sub = createClient();

(async () => {
  await pub.connect();
  await sub.connect();
})();

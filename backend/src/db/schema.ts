import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  user: text().notNull(),
  message: text(),
  type: text().notNull(),
  timestamp: date().defaultNow(),
});

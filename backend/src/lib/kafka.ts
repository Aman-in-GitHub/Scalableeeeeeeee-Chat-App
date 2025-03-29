import { CompressionTypes, Kafka, type Producer } from "kafkajs";
import { db } from "@/lib/drizzle.ts";
import { messagesTable } from "@/db/schema.ts";

export const kafka = new Kafka({
  clientId: "scalableeeeeeeee-kafka",
  brokers: ["localhost:9092"],
});

let producer: Producer | null = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(topic: string, message: string) {
  try {
    const producer = await createProducer();

    await producer.send({
      topic: topic,
      compression: CompressionTypes.GZIP,
      messages: [{ key: crypto.randomUUID(), value: message }],
    });
  } catch (error) {
    console.error("Failed to produce message:", error);
    producer = null;
  }
}

export async function startConsumer(topic: string, groupId: string) {
  const consumer = kafka.consumer({ groupId: groupId });
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachBatchAutoResolve: false,
    eachBatch: async ({ batch, isRunning, heartbeat, resolveOffset }) => {
      if (!isRunning()) return;

      const messagesToInsert = [];

      for (const msg of batch.messages) {
        if (!msg.value) {
          console.log("Skipping message with no value");
          continue;
        }

        try {
          const data = JSON.parse(msg.value.toString());
          messagesToInsert.push(data);
          await heartbeat();
        } catch (error) {
          console.error("Failed to handle message:", error);
        }

        if (messagesToInsert.length > 0) {
          try {
            await db.insert(messagesTable).values(messagesToInsert);
            resolveOffset(batch.messages[batch.messages.length - 1].offset);
          } catch (error) {
            console.error("Failed to insert messages:", error);
          }
        } else {
          if (batch.messages.length > 0) {
            resolveOffset(batch.messages[batch.messages.length - 1].offset);
          }
        }
      }
    },
  });
}

# Scalableeeeeeeee Chat App <a href="https://www.youtube.com/watch?v=b2F-DItXtZs&pp=ygUJd2ViIHNjYWxl0gcJCb0Ag7Wk3p_U">(built for web scale)</a>

The most scalable chat app in the world.

## Features

- **Real-time Messaging:** Instant message delivery and updates using Socket.IO.

- **Highly Scalable:** Designed with a microservices-friendly approach using Kafka for message queuing and Redis for caching and state management.

- **Persistent Storage:** Messages and user data stored reliably (using PostgreSQL with Drizzle ORM).

## How does it scale?

This application achieves high scalability through a combination of technologies:

1.  **Socket.IO:** Handles persistent WebSocket connections efficiently, enabling real-time, bidirectional communication between clients and the server.

2.  **Kafka:** Acts as a message broker. Instead of servers directly handling potentially thousands of messages, messages are produced to Kafka topics. Consumer services can then process these messages independently and reliably, allowing different parts of the system to scale horizontally. This decouples services and handles back-pressure gracefully.

3.  **Redis:** Used for high-speed caching (e.g., user sessions, presence status) and potentially as a Pub/Sub mechanism for broadcasting events across different server instances, reducing database load and improving responsiveness.

4.  **Node.js (with TypeScript):** The non-blocking, event-driven nature of Node.js is well-suited for I/O-heavy applications like chat. TypeScript adds static typing for better code quality and maintainability.

5.  **Database (PostgreSQL via Drizzle):** A robust relational database stores persistent data, while Drizzle ORM provides a type-safe interface.

This architecture allows individual components (WebSocket handlers, message processors, database writers) to be scaled independently based on load.

## 🛠️ Tech Stack

- **Backend:** Node.js, TypeScript
- **Frontend:** React, Tailwind CSS
- **Real-time Engine:** Socket.IO
- **Message Queue:** Kafka
- **Caching/PubSub:** Redis
- **Database ORM:** Drizzle ORM (PostgreSQL)

_**Friendly reminder**: MongoDB handles web scale._

<p align="center">Readme by <a href="https://gemini.google.com">Google Gemini</a></p>

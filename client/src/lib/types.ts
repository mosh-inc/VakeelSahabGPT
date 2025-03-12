import { Message } from "@shared/schema";

// Frontend message type extends the database Message type
export interface MessageType extends Message {
  // Any additional properties for the frontend
}

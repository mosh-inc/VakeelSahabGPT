import { Message } from "@shared/schema";

// Frontend message type extends the database Message type
export interface MessageType extends Message {
  // Frontend specific properties
  sources: string[] | null;
  category: string | null;
}

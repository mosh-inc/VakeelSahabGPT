import { messages, type Message, type InsertMessage, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message related methods
  getMessages(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: number): Promise<boolean>;
  getSessionIds(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messagesMap: Map<string, Message[]>; // sessionId -> messages
  currentUserId: number;
  currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.messagesMap = new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return this.messagesMap.get(sessionId) || [];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    
    // Ensure all required properties are set with proper defaults
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: now,
      category: insertMessage.category || null,
      sources: insertMessage.sources || null
    };
    
    const sessionMessages = this.messagesMap.get(message.sessionId) || [];
    sessionMessages.push(message);
    this.messagesMap.set(message.sessionId, sessionMessages);
    
    return message;
  }

  async deleteMessage(id: number): Promise<boolean> {
    // Search through all sessions for the message with the given id
    for (const sessionId of this.messagesMap.keys()) {
      const messages = this.messagesMap.get(sessionId) || [];
      const index = messages.findIndex((msg: Message) => msg.id === id);
      
      if (index !== -1) {
        // Remove the message from the array
        messages.splice(index, 1);
        
        // Update the messages map
        this.messagesMap.set(sessionId, messages);
        
        return true;
      }
    }
    
    return false;
  }
  
  async getSessionIds(): Promise<string[]> {
    return Array.from(this.messagesMap.keys());
  }
}

export const storage = new MemStorage();

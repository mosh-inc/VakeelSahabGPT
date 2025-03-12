import { messages, type Message, type InsertMessage, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message related methods
  getMessages(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
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
    
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: now
    };
    
    const sessionMessages = this.messagesMap.get(message.sessionId) || [];
    sessionMessages.push(message);
    this.messagesMap.set(message.sessionId, sessionMessages);
    
    return message;
  }

  async getSessionIds(): Promise<string[]> {
    return Array.from(this.messagesMap.keys());
  }
}

export const storage = new MemStorage();

import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  category: text("category"),
  sources: jsonb("sources"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  content: true,
  role: true,
  category: true,
  sources: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Legal categories
export const LEGAL_CATEGORIES = [
  "contracts",
  "family",
  "employment",
  "property",
  "ip",
  "criminal",
  "immigration",
  "personal_injury",
  "tax",
  "bankruptcy"
] as const;

export type LegalCategory = typeof LEGAL_CATEGORIES[number] | "all";

// Message validation for API
export const messageRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  sessionId: z.string().min(1, "Session ID is required"),
  category: z.enum(["all", ...LEGAL_CATEGORIES] as const).optional(),
});

export type MessageRequest = z.infer<typeof messageRequestSchema>;

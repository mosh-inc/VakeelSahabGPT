import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { messageRequestSchema, insertMessageSchema } from "@shared/schema";
import { generateLegalResponse } from "./openai";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Get chat messages for a session
  apiRouter.get("/messages/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message and get AI response
  apiRouter.post("/chat", async (req, res) => {
    try {
      // Validate request body
      const validatedData = messageRequestSchema.parse(req.body);
      const { message, sessionId, category } = validatedData;

      // Store user message
      const userMessage = insertMessageSchema.parse({
        sessionId,
        content: message,
        role: "user",
        category: category || null,
        sources: null
      });
      await storage.createMessage(userMessage);

      // Get previous messages for context
      const previousMessages = await storage.getMessages(sessionId);
      const chatHistory = previousMessages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Generate AI response
      const aiResponse = await generateLegalResponse(message, category, chatHistory);

      // Store AI response
      const assistantMessage = insertMessageSchema.parse({
        sessionId,
        content: aiResponse.content,
        role: "assistant",
        category: aiResponse.category,
        sources: aiResponse.sources
      });
      const savedMessage = await storage.createMessage(assistantMessage);

      // Return the AI response with metadata
      res.json({
        ...savedMessage,
        category: aiResponse.category,
        sources: aiResponse.sources
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ 
        message: "Failed to process your request. Please try again." 
      });
    }
  });

  // Get all active session IDs
  apiRouter.get("/sessions", async (_req, res) => {
    try {
      const sessionIds = await storage.getSessionIds();
      res.json(sessionIds);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });
  
  // Delete a message by ID
  apiRouter.delete("/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const messageId = parseInt(id, 10);
      
      if (isNaN(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      const success = await storage.deleteMessage(messageId);
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Register API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}

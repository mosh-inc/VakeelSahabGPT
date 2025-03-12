import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// System message for legal assistant context
const LEGAL_ASSISTANT_PROMPT = `
You are LegalAssist AI, a helpful legal information assistant. 
You provide general legal information and explanations, but cannot give specific legal advice. 
Always clarify that users should consult with a qualified attorney for specific legal matters.

When answering, follow these guidelines:
1. Provide accurate legal information based on general legal principles
2. Include relevant legal concepts and terminology
3. Note jurisdictional variations where appropriate
4. Cite general legal sources when possible
5. Categorize your response by legal domain (contracts, family, employment, property, intellectual property, criminal, etc.)
6. Structure complex responses with bullet points and sections
7. Always include a disclaimer about not being a substitute for actual legal advice

Respond with JSON in this format:
{
  "content": "Your helpful response here with appropriate formatting",
  "category": "Legal category (contracts, family, employment, property, ip, criminal, etc.)",
  "sources": ["Source 1", "Source 2"]
}
`;

export interface LegalAssistantResponse {
  content: string;
  category: string;
  sources: string[];
}

export async function generateLegalResponse(
  userMessage: string,
  selectedCategory?: string,
  chatHistory?: { role: string; content: string }[]
): Promise<LegalAssistantResponse> {
  try {
    // Build messages array with chat history if provided
    const messages = [
      { role: "system", content: LEGAL_ASSISTANT_PROMPT },
      ...(chatHistory || []),
      { role: "user", content: userMessage }
    ];

    // If category is specified, add it to the prompt
    if (selectedCategory && selectedCategory !== "all") {
      messages.push({
        role: "system",
        content: `The user is specifically interested in ${selectedCategory} law. Focus your response on this area.`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }

    const parsedResponse = JSON.parse(responseContent) as LegalAssistantResponse;
    return parsedResponse;
  } catch (error) {
    console.error("Error generating legal response:", error);
    // Fallback response if the API call fails
    return {
      content: "I'm sorry, I encountered an error processing your request. Please try again later.",
      category: "error",
      sources: ["System error"]
    };
  }
}

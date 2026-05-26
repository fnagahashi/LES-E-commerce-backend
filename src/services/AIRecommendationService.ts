import { GoogleGenAI } from "@google/genai";
import Book from "../entities/book";
import Order from "../entities/order";

export default class AIRecommendationService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  async recommendBooks(
    message: string,
    books: Book[],
    history: Order[],
  ): Promise<string> {
    if (books.length === 0) {
      return "Não encontrei livros relacionados ao que você pediu.";
    }

    const prompt = `
Você é um chatbot de recomendação de livros.

REGRAS:
- Recomende SOMENTE livros enviados.
- Nunca invente livros.
- Nunca invente categorias.
- Se não existir livro relevante, diga que não encontrou.
- Considere histórico do cliente.

Pergunta:
${message}

Histórico do cliente:
${JSON.stringify(history)}

Livros disponíveis:
${JSON.stringify(
  books.map((book) => ({
    title: book.title,
    author: book.author,
    category: book.category,
    description: book.description,
  })),
)}
`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      return response.text ?? "Não consegui gerar recomendação.";
    } catch (error) {
      console.error("Erro Gemini:", error);

      return `
Com base na sua busca
"${message}",

recomendo:

${books
  .slice(0, 3)
  .map((b) => b.title)
  .join(", ")}

Esses livros estão
disponíveis na loja.
`;
    }
  }
}

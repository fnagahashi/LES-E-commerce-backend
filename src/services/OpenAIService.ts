import OpenAI from "openai";
import Book from "../entities/book";
import Order from "../entities/order";

export default class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey:
        process.env.OPENAI_API_KEY,
    });
  }

  async recommendBooks(
    message: string,
    books: Book[],
    history: Order[]
  ): Promise<string> {

    if (books.length === 0) {
      return `
Não encontrei livros
relacionados ao que você pediu.
`;
    }

    const completion =
      await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: `
Você é um chatbot
de recomendação
de livros.

REGRAS IMPORTANTES:
- Recomende SOMENTE livros enviados.
- Nunca invente livros.
- Nunca invente categorias.
- Se não existir livro
relevante, diga que não encontrou.
- Baseie-se no histórico
de compras do cliente.
`,
          },

          {
            role: "user",
            content: `
Pergunta:
${message}

Histórico do cliente:
${JSON.stringify(history)}

Livros disponíveis:
${JSON.stringify(
  books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    category:
      book.category,
    description:
      book.description,
  }))
)}
`,
          },
        ],
      });

    return (
      completion.choices[0]
        .message.content ??
      "Não consegui gerar recomendação."
    );
  }
}
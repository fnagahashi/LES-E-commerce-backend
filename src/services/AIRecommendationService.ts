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

    try {
      const prompt = `
Você é um assistente de recomendação
de livros.

REGRAS OBRIGATÓRIAS:
- Recomende SOMENTE os livros enviados.
- NÃO invente livros.
- NÃO invente autores.
- NÃO invente categorias.
- NÃO fale de livros que não estejam na lista.
- Considere o histórico do cliente.
- Explique brevemente por que os livros combinam com o pedido.

Pedido do cliente:
"${message}"

Histórico de compras:
${history
  .reduce<string[]>((titles, order) => {
    titles.push(...order.orderItems.map((item) => item.book?.title ?? ""));
    return titles;
  }, [])
  .filter((title) => title)
  .join(", ")}

Livros disponíveis para recomendar:
${books
  .map(
    (book) => `
Título: ${book.title}
Autor: ${book.author}
Categoria: ${book.category}
Descrição: ${book.description}
`,
  )
  .join("\n")}

Seja natural e amigável.
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      return response.text ?? "Não consegui gerar recomendação.";
    } catch (error) {
      console.error("Erro Gemini:", error);

      return `
Encontrei alguns livros
que podem combinar
com o que você procura:

${books
  .slice(0, 3)
  .map((book) => `• ${book.title} (${book.category})`)
  .join("\n")}
`;
    }
  }

  async extractIntent(message: string): Promise<{
    category: string;
    keywords: string[];
  }> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
Você é um classificador
de intenção para uma
livraria.

Tarefa:
Entender o significado
da mensagem do usuário.

IMPORTANTE:
- Retorne APENAS JSON válido.
- Nunca explique.
- Nunca use markdown.
- Nunca repita as palavras
da frase do usuário.
- Interprete semântica.

Categorias possíveis:
[
"fantasia",
"romance",
"terror",
"suspense",
"biografia",
"aventura",
]

Exemplos:

Entrada:
quero livro sobre a vida de outra pessoa

Saída:
{
  "category": "biografia",
  "keywords": [
    "vida real",
    "historia real",
    "biografia"
  ]
}

Entrada:
quero algo de magia

Saída:
{
  "category": "fantasia",
  "keywords": [
    "magia",
    "aventura",
    "mundo fantastico"
  ]
}

Entrada:
quero algo romantico

Saída:
{
  "category": "romance",
  "keywords": [
    "amor",
    "casal",
    "romantico"
  ]
}

Entrada:
${message}

Saída:
`,
      });

      const text = response.text ?? "{}";

      console.log("Resposta bruta Gemini:", text);

      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanText);

      return {
        category: parsed.category ?? "",
        keywords: parsed.keywords ?? [],
      };
    } catch (error) {
      console.error("Erro interpretando intenção:", error);

      return {
        category: "",
        keywords: [],
      };
    }
  }
}

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
Você é um assistente
de recomendação
de livros de uma livraria.

REGRAS OBRIGATÓRIAS:
- Recomende SOMENTE livros enviados.
- NÃO invente livros.
- NÃO invente autores.
- NÃO invente categorias.
- Seja breve.
- Use no máximo 3 recomendações.
- Cada recomendação deve ter no máximo 1 frase curta.
- Responda no máximo em 4 linhas.
- NÃO escreva introdução longa.
- NÃO faça resumo do histórico.
- NÃO explique demais.
- Se houver histórico, use-o discretamente.

Pedido do cliente:
"${message}"

Histórico de compras:
${history
  .reduce<string[]>((titles, order) => {
    titles.push(...order.orderItems.map((item) => item.book?.title ?? ""));

    return titles;
  }, [])
  .filter(Boolean)
  .join(", ")}

Livros disponíveis:
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

Formato obrigatório:

Posso te recomendar:

• Livro — motivo curto

• Livro — motivo curto

Seja natural.
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text ?? "Não consegui gerar recomendação.";
    } catch (error) {
      console.error("Erro Gemini:", error);

      return `
Não existem livros para recomendar. Mas encontrei alguns livros
que podem combinar
com você:

${books
  .slice(0, 3)
  .map((book) => `• ${book.title} (${book.category})`)
  .join("\n")}
`;
    }
  }

  async extractIntent(message: string): Promise<{
    valid: boolean;
    reason: string;
    category: string;
    keywords: string[];
    useHistory?: boolean;
  }> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
Você é um classificador
de intenção de uma
livraria virtual.

Sua função NÃO é
recomendar livros.

Sua função é:

1. entender o que
o usuário realmente quer;

2. decidir se o pedido
faz sentido para uma
recomendação de livros.

REGRAS:

- Retorne APENAS JSON válido.
- Nunca use markdown.
- Nunca explique fora do JSON.
- Interprete significado
semântico da frase.

Categorias possíveis:
[
"fantasia",
"romance",
"terror",
"suspense",
"biografia",
"aventura"
]

Um pedido é VÁLIDO quando:
- pede gênero;
- pede tema;
- pede assunto;
- pede estilo de leitura;
- pede algo parecido
com outro livro.

Um pedido é INVÁLIDO quando:
- mistura atividade sem relação
com leitura;
- pede algo sem sentido;
- tenta relacionar livro
com situações absurdas;
- fala de assuntos
que não ajudam
na recomendação.

Formato obrigatório:

{
  "valid": true,
  "reason": "",
  "category": "",
  "keywords": [],
  "useHistory": false
}

EXEMPLOS:

Entrada:
"me recomenda algo parecido com o que eu gosto"

Saída:
{
  "valid": true,
  "reason": "",
  "category": "",
  "keywords": [],
  "useHistory": true
}

Entrada:
"qual livro de romance você me sugere?"

Saída:
{
  "valid": true,
  "reason": "",
  "category": "romance",
  "keywords": [
    "amor",
    "relacionamento"
  ]
}

Entrada:
"quero livro sobre a vida de outra pessoa"

Saída:
{
  "valid": true,
  "reason": "",
  "category": "biografia",
  "keywords": [
    "vida real",
    "historia real",
    "biografia"
  ]
}

Entrada:
"qual livro ler enquanto mergulho em alto mar"

Saída:
{
  "valid": false,
  "reason":
    "A situação não faz sentido para recomendar livros.",
  "category": "",
  "keywords": []
}

Entrada:
"o pequeno principe é bom para ler no banho?"

Saída:
{
  "valid": false,
  "reason":
    "A pergunta relaciona leitura com uma situação sem relevância para recomendação.",
  "category": "",
  "keywords": []
}

Entrada:
"qual carro devo comprar enquanto leio romance?"

Saída:
{
  "valid": false,
  "reason":
    "A pergunta não é sobre recomendação de livros.",
  "category": "",
  "keywords": []
}

IMPORTANTE:

Se a mensagem:
- relacionar leitura com veículos;
- comida;
- banho;
- esporte;
- atividades físicas;
- situações absurdas;
- objetos sem relação com livros;

retorne SEMPRE:

{
  "valid": false,
  "reason":
    "Não consigo recomendar livros para esse tipo de pedido.",
  "category": "",
  "keywords": [],
  "useHistory": false
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
        valid: parsed.valid ?? false,
        reason: parsed.reason ?? "",
        category: parsed.category ?? "",
        keywords: parsed.keywords ?? [],
        useHistory: parsed.useHistory ?? false,
      };
    } catch (error) {
      console.error("Erro interpretando intenção:", error);

      return {
        valid: false,
        reason: "Não foi possível interpretar a intenção.",
        category: "",
        keywords: [],
      };
    }
  }

  async generateInvalidRequestResponse(
    message: string,
    reason: string,
  ): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
Você é um chatbot
de uma livraria.

O usuário fez um pedido
que NÃO faz sentido
para recomendar livros.

Sua função:
- responder de forma natural;
- explicar brevemente
por que não é possível
recomendar livros;
- NÃO inventar livros;
- NÃO sugerir coisas absurdas;
- manter tom amigável;
- no máximo 2 frases.

Mensagem do usuário:
"${message}"

Motivo:
"${reason}"

Exemplos de estilo:

Usuário:
"qual livro ler mergulhando no mar"

Resposta:
"Não consigo recomendar livros para esse tipo de situação, porque a pergunta mistura leitura com uma atividade que não ajuda a escolher um livro."

Usuário:
"qual carro comprar lendo romance"

Resposta:
"Parece que sua pergunta não é sobre recomendação de livros. Se quiser, posso indicar romances disponíveis na loja."

Usuário:
"o pequeno príncipe é bom no banho?"

Resposta:
"Não consigo avaliar livros com base nesse tipo de situação. Posso te dizer se o livro é bom dependendo do gênero ou estilo que você gosta."
`,
      });

      return response.text ?? "Não consigo recomendar livros para isso.";
    } catch {
      return reason || "Não consigo recomendar livros para isso.";
    }
  }
}

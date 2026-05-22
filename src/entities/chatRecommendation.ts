import entity from "./entity";
import Client from "./client";
import Book from "./book";
import Order from "./order";

export default class ChatRecommendation
  extends entity {

  client!: Client;

  message!: string;

  recommendedBooks: Book[] = [];

  purchaseHistory: Order[] = [];

  response!: string;

  constructor(
    client: Client,
    message: string
  ) {
    super();

    this.client = client;
    this.message = message;
  }
}
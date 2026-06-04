import { AppDataSource } from "./database/index";
import Address from "./entities/address";
import Book from "./entities/book";
import Client from "./entities/client";
import Delivery from "./entities/delivery";
import Order from "./entities/order";
import OrderItem from "./entities/orderItem";
import { OrderStatus } from "./enum/OrderStatus";

const ORDERS_PER_MONTH_MIN = 4;
const ORDERS_PER_MONTH_MAX = 10;
const ITEMS_PER_ORDER_MIN = 1;
const ITEMS_PER_ORDER_MAX = 4;
const MONTHS_TO_SEED = 13;


function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function dateForMonth(monthsAgo: number): Date {
  const date = new Date();
  date.setDate(randomInt(1, 28));
  date.setMonth(date.getMonth() - monthsAgo);
  date.setHours(randomInt(8, 22), randomInt(0, 59), 0, 0);
  return date;
}


async function seed() {
  console.log("🔌 Conectando ao banco de dados...");
  await AppDataSource.initialize();

  const clientRepo   = AppDataSource.getRepository(Client);
  const bookRepo     = AppDataSource.getRepository(Book);
  const addressRepo  = AppDataSource.getRepository(Address);
  const deliveryRepo = AppDataSource.getRepository(Delivery);
  const orderRepo    = AppDataSource.getRepository(Order);
  const itemRepo     = AppDataSource.getRepository(OrderItem);


  const clients = await clientRepo.find({ take: 10 });
  if (clients.length === 0) {
    console.error("❌ Nenhum cliente encontrado. Cadastre ao menos 1 cliente antes de rodar o seed.");
    process.exit(1);
  }

  const books = await bookRepo.find({ where: { active: true } });
  if (books.length === 0) {
    console.error("❌ Nenhum livro ativo encontrado. Cadastre ao menos 1 livro antes de rodar o seed.");
    process.exit(1);
  }

  const categoriesInDB = Array.from(new Set(books.map((b) => b.category)));
  console.log(`📚 Livros encontrados: ${books.length} | Categorias: ${categoriesInDB.join(", ")}`);
  console.log(`👤 Clientes encontrados: ${clients.length}`);

  let seedAddress = await addressRepo.findOne({
    where: { addressNickname: "SEED_ADDRESS" },
  });

  if (!seedAddress) {
    const newAddress = new Address(
      "Casa",
      "SEED_ADDRESS",
      "Rua",
      "01310-100",
      "Avenida Paulista",
      "Bela Vista",
      "1000",
      "São Paulo",
      "SP",
      "Brasil",
      "Endereço gerado pelo seed",
      true,
      false,
    );
    seedAddress = await addressRepo.save(newAddress);
    console.log("📍 Endereço de seed criado.");
  } else {
    console.log("📍 Endereço de seed já existia, reutilizando.");
  }

  let totalOrders = 0;
  let totalItems  = 0;

  for (let monthsAgo = MONTHS_TO_SEED - 1; monthsAgo >= 0; monthsAgo--) {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - monthsAgo);
    const label = targetDate.toLocaleString("pt-BR", { month: "long", year: "numeric" });

    const ordersThisMonth = randomInt(ORDERS_PER_MONTH_MIN, ORDERS_PER_MONTH_MAX);
    console.log(`\n📅 ${label} — gerando ${ordersThisMonth} pedidos...`);

    for (let i = 0; i < ordersThisMonth; i++) {
      const client = randomItem(clients);
      const orderDate = dateForMonth(monthsAgo);

      const itemCount = randomInt(ITEMS_PER_ORDER_MIN, ITEMS_PER_ORDER_MAX);
      const shuffledBooks = [...books].sort(() => Math.random() - 0.5);
      const selectedBooks = shuffledBooks.slice(0, itemCount);

      let orderTotal = 0;
      const freightValue = (randomInt(1, 4) * 5).toFixed(2);

      const order = new Order(
        client,
        [],
        [],       
        null as any,
        orderDate,
        "0",
        freightValue,
        OrderStatus.delivered,
        false,
      );
      const savedOrder = await orderRepo.save(order);

      const savedItems: OrderItem[] = [];
      for (const book of selectedBooks) {
        const quantity  = randomInt(1, 3);
        const unitPrice = parseFloat(book.price);
        const itemTotal = unitPrice * quantity;
        orderTotal     += itemTotal;

        const item = new OrderItem(
          savedOrder,
          book,
          quantity,
          unitPrice.toFixed(2),
          itemTotal.toFixed(2),
          false,
        );
        savedItems.push(await itemRepo.save(item));
      }

      const delivery = new Delivery(
        savedOrder,
        seedAddress,
        randomItem(["PAC", "SEDEX", "Transportadora"]),
        freightValue,
      );
      const savedDelivery = await deliveryRepo.save(delivery);

      savedOrder.totalPrice  = (orderTotal + parseFloat(freightValue)).toFixed(2);
      savedOrder.delivery    = savedDelivery;
      savedOrder.orderItems  = savedItems;
      await orderRepo.save(savedOrder);

      totalOrders++;
      totalItems += savedItems.length;
    }
  }

  console.log("\n✅ Seed concluído!");
  console.log(`   Pedidos criados : ${totalOrders}`);
  console.log(`   Itens criados   : ${totalItems}`);
  console.log(`   Período         : ${MONTHS_TO_SEED} meses`);

  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
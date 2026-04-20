import request from "supertest";
import app from "../server";
import { AppDataSource } from "../database";

describe("Registro de Pedido - Integração REAL", () => {
  let token: string;
  beforeAll(async () => {
    process.env.NODE_ENV = "test";

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const loginResponse = await request(app).post("/api/login").send({
      email: "barbara_dossantos@parker.com",
      password: "Ba12345678*",
    });

    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  test("deve registrar pedido com sucesso com entrega em 06/10/2025", async () => {
    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        clientId: {
          id: "be561743-1d30-4e1f-8d3c-ba9694ee90ae",
          name: "Bárbara Juliana Valentina dos Santos",
        },

        orderItems: [
          {
            bookId: "88e55e63-58fa-4ce0-9ce1-d5642af8c3cd",
            quantity: 1,
            unitaryValue: "52.90",
            totalItemValue: "52.90",
          },
          {
            bookId: "a5509d57-5130-4073-a169-7f88d2537f2f",
            quantity: 2,
            unitaryValue: "44.90",
            totalItemValue: "89.80",
          },
        ],

        payments: [
          {
            paymentMethod: "CREDIT_CARD",
            paymentValue: "147.70",
            paymentStatus: "APPROVED",
            creditCard: {
              id: "f093a981-38c9-47f2-b18f-50ce88e1ec0c",
            },
          },
        ],

        delivery: {
          address: {
            id: "9b4356b7-692a-4e1d-8774-00250eab1d00",
          },
          frightType: "STANDARD",
          freightValue: "0",
        },
        orderDate: "2025-10-06",
        totalPrice: "147.70",
      });

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.order.freightValue).toBe("5");
    expect(response.body.order.totalPrice).toBe("147.70");
    expect(response.body.order).toHaveProperty("id");
  });
});

import request from 'supertest';
import app from '../server';
import { AppDataSource } from '../database';

describe('Registro de Pedido - Integração REAL', () => {

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  test('deve registrar pedido com sucesso com entrega em 06/10/2025', async () => {

    const response = await request(app)
      .post('/api/orders')
      .send({
        clientId: {
          id: 1,
          name: 'Cliente Teste'
        },

        orderItems: [
          {
            bookId: 1,
            quantity: 1,
            unitaryValue: "50",
            totalItemValue: "50",
          }
        ],

        payments: [
          {
            paymentMethod: "CREDIT_CARD",
            paymentValue: "50",
            paymentStatus: "APPROVED",
            creditCard: {
              id: 1
            }
          }
        ],

        deliveryId: 1,
        orderDate: "2025-10-06",
        totalPrice: "50",
        freightValue: "10"
      });

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Pedido realizado com sucesso");
    expect(response.body.order).toHaveProperty('id');
  });

});
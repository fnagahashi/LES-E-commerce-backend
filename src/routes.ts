// src/routes.ts
import { Router } from "express";
import { ClientController } from "./controller/client/ClientController";
import { AppDataSource } from "./database";
import Facade from "./facade/Facade";
import Client from "./entities/client";
import ClientDAO from "./DAO/Interface/ClientDAO";
import AddressDAO from "./DAO/Interface/AddressDAO";
import LogDAO from "./DAO/Interface/LogDAO";
import { ensureAuthenticated } from "./midleware/ensureAuthenticated";
import { ensureAdmin } from "./midleware/ensureAdmin";
import CreditCardDAO from "./DAO/Interface/CreditCardDAO";
import OrderDAO from "./DAO/Interface/OrderDAO";
import PaymentDAO from "./DAO/Interface/PaymentDAO";
import StockDAO from "./DAO/Interface/StockDAO";
import { OrderController } from "./controller/OrderController";
import CupomDAO from "./DAO/Interface/CupomDAO";

export const createRouter = () => {
  const router = Router();

  const facade = new Facade(
    new ClientDAO(AppDataSource),
    new AddressDAO(AppDataSource),
    new CreditCardDAO(AppDataSource),
    new OrderDAO(AppDataSource),
    new StockDAO(AppDataSource),
    new LogDAO(AppDataSource),
  );

  const clientController = new ClientController(facade);
  const orderController = new OrderController(facade);
  router.post("/login", (req, res) => clientController.login(req, res));

  router.post("/clients", (req, res) => clientController.create(req, res));
  router.get("/clients", ensureAuthenticated, ensureAdmin, (req, res) =>
    clientController.find(req, res),
  );
  router.get("/clients/:id", ensureAuthenticated, (req, res) =>
    clientController.findById(req, res),
  );
  router.get("/clients/search", ensureAuthenticated, (req, res) =>
    clientController.findByFilters(req, res),
  );
  router.patch("/clients/:id/", ensureAuthenticated, (req, res) =>
    clientController.deleteCreditCard(req, res),
  );
  router.patch("/clients/:id", ensureAuthenticated, (req, res) =>
    clientController.deleteAddress(req, res),
  );
  router.put("/clients/:id", ensureAuthenticated, (req, res) =>
    clientController.update(req, res),
  );
  router.patch(
    "/clients/:id/inactivate",
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => clientController.inactivate(req, res),
  );
  router.patch(
    "/clients/:id/activate",
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => clientController.activate(req, res),
  );
  router.patch("/clients/:id/changePassword", ensureAuthenticated, (req, res) =>
    clientController.changePassword(req, res),
  );
  router.delete("/clients/:id", ensureAuthenticated, (req, res) =>
    clientController.delete(req, res),
  );

  //Rota para pegar cupons de acordo com o cliente
  router.get("/clients/:id/cupons", ensureAuthenticated, (req, res) =>
    clientController.getCupons(req, res),
  );

  // Rotas venda
  router.post("/orders", ensureAuthenticated, (req, res) =>
    orderController.create(req, res),
  );
  router.patch(
    "/orders/:id/approve",
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => orderController.approveOrder(req, res),
  );
  router.patch(
    "/orders/:id/reprove",
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => orderController.reproveOrder(req, res),
  );
  router.patch(
    "/orders/:id/ship",
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => orderController.shipOrder(req, res),
  );
  router.patch(
    "/orders/:id/confirmDelivery",
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => orderController.confirmDelivery(req, res),
  );
  router.patch("/orders/:id/requestExchange", ensureAuthenticated, (req, res) =>
    orderController.requestExchange(req, res),
  );
  router.patch(
    "/orders/:id/authorizeExchange",
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => orderController.authorizeExchange(req, res),
  );
  router.patch(
    "/orders/:id/confirmExchange",
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => orderController.confirmExchange(req, res),
  );
  router.get("/orders/:id", ensureAuthenticated, ensureAdmin, (req, res) =>
    orderController.findById(req, res),
  );
  router.get("/orders", ensureAuthenticated, ensureAdmin, (req, res) =>
    orderController.findAll(req, res),
  );

  router.get("/health", (req, res) => {
    res.json({
      success: true,
      message: "API Booklovers - Servidor rodando",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      endpoints: {
        clients: "/api/clients",
      },
    });
  });

  router.get("/", (req, res) => {
    res.json({
      message: "Bem-vindo à API da Livraria Booklovers",
      documentation: "Consulte /api/health para lista completa de endpoints",
      version: "1.0.0",
    });
  });

  return router;
};

// src/routes.ts
import { Router } from "express";
import { ClientController } from "./controller/client/ClientController";
import { RoomController } from "../src/controller/room/RoomController";
import { ReservationController } from "../src/controller/reservation/ReservationController";
import { PaymentController } from "../src/controller/payment/PaymentController";
import { SaleController } from "../src/controller/sale/SaleController";
import { PolicyController } from "../src/controller/policy/PolicyController";
import { AppDataSource } from "./database";
import Facade from "./facade/Facade";
import Client from "./entities/client";
import ClientDAO from "./DAO/Interface/ClientDAO";
import AddressDAO from "./DAO/Interface/AddressDAO";
import ReservationDAO from "./DAO/Interface/ReservationDAO";
import PaymentDAO from "./DAO/Interface/PaymentDAO";
import RoomDAO from "./DAO/Interface/RoomDAO";
import LogDAO from "./DAO/Interface/LogDAO";
import SaleDAO from "./DAO/Interface/SaleDAO";


const router = Router();

const startApp = async () => {
  const facade = new Facade(
    new ClientDAO(AppDataSource),
    new AddressDAO(AppDataSource),
    new ReservationDAO(AppDataSource),
    new PaymentDAO(AppDataSource),
    new RoomDAO(AppDataSource),
    new LogDAO(AppDataSource),
    new SaleDAO(AppDataSource),
  );

  const clientController = new ClientController(facade);
  const roomController = new RoomController(facade);
  const reservationController = new ReservationController(facade);
  const paymentController = new PaymentController(facade);
  const saleController = new SaleController(facade);
  const policyController = new PolicyController(facade);

  router.post("/clients", (req, res) => clientController.create(req, res));
  router.get("/clients", (req, res) => clientController.findAll(req, res));
  router.get("/clients/:id", (req, res) => clientController.findById(req, res));
  router.get("/clients/search", (req, res) =>
    clientController.findByFilters(req, res),
  );
  router.put("/clients/:id", (req, res) => clientController.update(req, res));
  router.patch("/clients/:id/inactivate", (req, res) =>
    clientController.inactivate(req, res),
  );
  router.patch("/clients/:id/activate", (req, res) =>
    clientController.activate(req, res),
  );
  router.delete("/clients/:id", (req, res) =>
    clientController.delete(req, res),
  );


  router.get("/health", (req, res) => {
    res.json({
      success: true,
      message: "API Booklovers - Servidor rodando",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      endpoints: {
        clients: "/api/clients",
        rooms: "/api/rooms",
        reservations: "/api/reservations",
        payments: "/api/payments",
        sales: "/api/sales",
        policies: "/api/policies",
        reports: "/api/reports",
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
};

startApp();

export default router;

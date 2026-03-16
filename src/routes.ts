// src/routes.ts
import { Router } from "express";
import { ClientController } from "./controller/client/ClientController";
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
  router.patch("/clients/:id/changePassword", (req, res) =>
    clientController.changePassword(req, res),
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

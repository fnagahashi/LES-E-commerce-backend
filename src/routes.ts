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

const router = Router();

const startApp = async () => {
  const facade = new Facade(
    new ClientDAO(AppDataSource),
    new AddressDAO(AppDataSource),
    new LogDAO(AppDataSource),
  );

  const clientController = new ClientController(facade);
  router.post("/login", (req, res) => clientController.login(req, res));

  router.post("/clients", (req, res) => clientController.create(req, res));
  router.get("/clients", ensureAuthenticated, clientController.findAll);
  router.get("/clients/:id", ensureAuthenticated, (req, res) =>
    clientController.findById(req, res),
  );
  router.get("/clients/search", ensureAuthenticated, (req, res) =>
    clientController.findByFilters(req, res),
  );
  router.put("/clients/:id", ensureAuthenticated, (req, res) =>
    clientController.update(req, res),
  );
  router.patch("/clients/:id/inactivate", ensureAuthenticated, (req, res) =>
    clientController.inactivate(req, res),
  );
  router.patch("/clients/:id/activate", ensureAuthenticated, (req, res) =>
    clientController.activate(req, res),
  );
  router.patch("/clients/:id/changePassword", ensureAuthenticated, (req, res) =>
    clientController.changePassword(req, res),
  );
  router.delete("/clients/:id", ensureAuthenticated, (req, res) =>
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

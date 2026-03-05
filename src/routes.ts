// src/routes.ts
import { Router } from "express";
import { GuestController } from "./controller/client/ClientController";
import { RoomController } from "../src/controller/room/RoomController";
import { ReservationController } from "../src/controller/reservation/ReservationController";
import { PaymentController } from "../src/controller/payment/PaymentController";
import { SaleController } from "../src/controller/sale/SaleController";
import { PolicyController } from "../src/controller/policy/PolicyController";
import { AppDataSource } from "./database";
import Facade from "./facade/Facade";
import Guest from "./entities/client";
import GuestDAO from "./DAO/Interface/GuestDAO";
import AddressDAO from "./DAO/Interface/AddressDAO";
import Reservation from "./entities/reservation";
import ReservationDAO from "./DAO/Interface/ReservationDAO";
import PaymentDAO from "./DAO/Interface/PaymentDAO";
import RoomDAO from "./DAO/Interface/RoomDAO";
import LogDAO from "./DAO/Interface/LogDAO";
import SaleDAO from "./DAO/Interface/SaleDAO";
import Address from "./entities/address";
import Payment from "./entities/payment";
import Room from "./entities/room";
import Log from "./entities/log";
import Sale from "./entities/sale";

const router = Router();

const startApp = async () => {
  // Inicializar Facade e Controllers
  const facade = new Facade(
    new GuestDAO(AppDataSource),
    new AddressDAO(AppDataSource),
    new ReservationDAO(AppDataSource),
    new PaymentDAO(AppDataSource),
    new RoomDAO(AppDataSource),
    new LogDAO(AppDataSource),
    new SaleDAO(AppDataSource),
  );

  const guestController = new GuestController(facade);
  const roomController = new RoomController(facade);
  const reservationController = new ReservationController(facade);
  const paymentController = new PaymentController(facade);
  const saleController = new SaleController(facade);
  const policyController = new PolicyController(facade);

  // ==================== ROTAS DE HÓSPEDES (RF0101-RF0104) ====================
  router.post("/guests", (req, res) => guestController.create(req, res)); // RF0101
  router.get("/guests", (req, res) => guestController.findAll(req, res)); // RF0104
  router.get("/guests/:id", (req, res) => guestController.findById(req, res)); // RF0104
  router.get("/guests/cpf/:cpf", (req, res) =>
    guestController.findByCpf(req, res),
  ); // RF0104
  router.put("/guests/:id", (req, res) => guestController.update(req, res)); // RF0102
  router.patch("/guests/:id/inactivate", (req, res) =>
    guestController.inactivate(req, res),
  ); // RF0103
  router.patch("/guests/:id/activate", (req, res) =>
    guestController.activate(req, res),
  ); // RF0103
  router.delete("/guests/:id", (req, res) => guestController.delete(req, res));

  // ==================== ROTAS DE QUARTOS (RF0111-RF0114) ====================
  router.post("/rooms", (req, res) => roomController.criar(req, res)); // RF0111
  router.get("/rooms", (req, res) => roomController.buscarTodos(req, res)); // RF0114
  router.get("/rooms/disponiveis", (req, res) =>
    roomController.buscarDisponiveis(req, res),
  ); // RF0114
  router.get("/rooms/filtro", (req, res) =>
    roomController.buscarPorFiltro(req, res),
  ); // RF0114
  router.get("/rooms/:id", (req, res) => roomController.buscarPorId(req, res)); // RF0114
  router.get("/rooms/codigo/:roomCode", (req, res) =>
    roomController.buscarPorRoomCode(req, res),
  ); // RF0114
  router.get("/rooms/tipo/:type", (req, res) =>
    roomController.buscarPorTipo(req, res),
  ); // RF0114
  router.put("/rooms/:id", (req, res) => roomController.atualizar(req, res)); // RF0112
  router.patch("/rooms/:id/preco", (req, res) =>
    roomController.atualizarPreco(req, res),
  ); // RF0112
  router.patch("/rooms/:id/inativar", (req, res) =>
    roomController.inativar(req, res),
  ); // RF0113
  router.patch("/rooms/:id/ativar", (req, res) =>
    roomController.ativar(req, res),
  ); // RF0113
  router.get("/rooms/estatisticas/geral", (req, res) =>
    roomController.getEstatisticas(req, res),
  );
  router.delete("/rooms/:id", (req, res) => roomController.deletar(req, res));

  // ==================== ROTAS DE RESERVAS (RF0201-RF0209) ====================
  router.get("/reservations/disponibilidade", (req, res) =>
    reservationController.consultarDisponibilidade(req, res),
  ); // RF0201
  router.post("/reservations", (req, res) =>
    reservationController.create(req, res),
  ); // RF0202
  router.get("/reservations", (req, res) =>
    reservationController.buscarPorFiltro(req, res),
  ); // RF0206
  router.get("/reservations/:id", (req, res) =>
    reservationController.buscarPorId(req, res),
  ); // RF0206
  router.get("/reservations/guest/:guestId", (req, res) =>
    reservationController.buscarPorGuest(req, res),
  ); // RF0206
  router.patch("/reservations/:id/confirmar", (req, res) =>
    reservationController.confirmarReserva(req, res),
  ); // RF0203
  router.patch("/reservations/:id/cancelar", (req, res) =>
    reservationController.cancelarReserva(req, res),
  ); // RF0205
  router.patch("/reservations/:id/no-show", (req, res) =>
    reservationController.marcarNoShow(req, res),
  ); // RF0207
  router.put("/reservations/:id", (req, res) =>
    reservationController.atualizar(req, res),
  ); // RF0204
  router.patch("/reservations/:id/status-pagamento", (req, res) =>
    reservationController.atualizarStatusPagamento(req, res),
  );
  router.get("/reservations/estatisticas/geral", (req, res) =>
    reservationController.getEstatisticas(req, res),
  );
  router.delete("/reservations/:id", (req, res) =>
    reservationController.delete(req, res),
  );

  // ==================== ROTAS DE PAGAMENTOS (RF0211-RF0214) ====================
  router.post("/payments", (req, res) =>
    paymentController.iniciarPagamento(req, res),
  ); // RF0211
  router.get("/payments", (req, res) =>
    paymentController.buscarPorFiltro(req, res),
  ); // RF0214
  router.get("/payments/:id", (req, res) =>
    paymentController.buscarPorId(req, res),
  ); // RF0214
  router.get("/payments/reserva/:reservationId", (req, res) =>
    paymentController.buscarPorReserva(req, res),
  ); // RF0214
  router.get("/payments/status/:status", (req, res) =>
    paymentController.buscarPorStatus(req, res),
  ); // RF0214
  router.get("/payments/tipo/:type", (req, res) =>
    paymentController.buscarPorTipo(req, res),
  ); // RF0214
  router.patch("/payments/:id/resultado", (req, res) =>
    paymentController.registrarResultado(req, res),
  ); // RF0212
  router.patch("/payments/:id/estornar", (req, res) =>
    paymentController.estornarPagamento(req, res),
  ); // RF0213
  router.patch("/payments/:id/marcar-pago", (req, res) =>
    paymentController.marcarComoPago(req, res),
  );
  router.put("/payments/:id", (req, res) =>
    paymentController.atualizar(req, res),
  );
  router.get("/payments/estatisticas/geral", (req, res) =>
    paymentController.getEstatisticas(req, res),
  );

  // ==================== ROTAS DE PROMOÇÕES (RF0121-RF0124) ====================
  router.post("/sales", (req, res) => saleController.criar(req, res)); // RF0121
  router.get("/sales", (req, res) => saleController.buscarTodas(req, res)); // RF0124
  router.get("/sales/vigentes", (req, res) =>
    saleController.buscarVigentes(req, res),
  ); // RF0124
  router.get("/sales/filtro", (req, res) =>
    saleController.buscarPorFiltro(req, res),
  ); // RF0124
  router.get("/sales/:id", (req, res) => saleController.buscarPorId(req, res)); // RF0124
  router.get("/sales/codigo/:codigoSale", (req, res) =>
    saleController.buscarPorCodigo(req, res),
  ); // RF0124
  router.put("/sales/:id", (req, res) => saleController.atualizar(req, res)); // RF0122
  router.patch("/sales/:id/inativar", (req, res) =>
    saleController.inativar(req, res),
  ); // RF0123
  router.patch("/sales/:id/ativar", (req, res) =>
    saleController.ativar(req, res),
  ); // RF0123
  router.post("/sales/:codigoSale/calcular-desconto", (req, res) =>
    saleController.calcularDesconto(req, res),
  );
  router.get("/sales/:codigoSale/disponibilidade", (req, res) =>
    saleController.verificarDisponibilidade(req, res),
  );
  router.get("/sales/estatisticas/geral", (req, res) =>
    saleController.getEstatisticas(req, res),
  );

  // ==================== ROTAS DE POLÍTICAS (RF0131-RF0134) ====================
  router.post("/policies", (req, res) => policyController.criar(req, res)); // RF0131
  router.get("/policies", (req, res) => policyController.buscarTodas(req, res)); // RF0134
  router.get("/policies/ativas", (req, res) =>
    policyController.buscarAtivas(req, res),
  ); // RF0134
  router.get("/policies/filtro", (req, res) =>
    policyController.buscarPorFiltro(req, res),
  ); // RF0134
  router.get("/policies/:id", (req, res) =>
    policyController.buscarPorId(req, res),
  ); // RF0134
  router.put("/policies/:id", (req, res) =>
    policyController.atualizar(req, res),
  ); // RF0132
  router.patch("/policies/:id/inativar", (req, res) =>
    policyController.inativar(req, res),
  ); // RF0133
  router.patch("/policies/:id/ativar", (req, res) =>
    policyController.ativar(req, res),
  ); // RF0133
  router.post("/policies/:policyId/calcular-multa", (req, res) =>
    policyController.calcularMultaCancelamento(req, res),
  );
  router.get("/policies/estatisticas/geral", (req, res) =>
    policyController.getEstatisticas(req, res),
  );

  router.get("/health", (req, res) => {
    res.json({
      success: true,
      message: "API Hotel - Servidor rodando",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      endpoints: {
        guests: "/api/guests",
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
      message: "Bem-vindo à API do Sistema de Hotel",
      documentation: "Consulte /api/health para lista completa de endpoints",
      version: "1.0.0",
    });
  });
};

startApp();

export default router;

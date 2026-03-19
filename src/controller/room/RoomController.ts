// // src/controllers/RoomController.ts
// import { Request, Response } from "express";
// import Facade from "../../facade/Facade";
// import Room from "../../entities/room";
// import { RoomType } from "../../enum/RoomType";

// export class RoomController {
//   constructor(private readonly facade: Facade) {}

//   public async criar(req: Request, res: Response): Promise<void> {
//     try {
//       const roomDefinido: Room = await this.definirRoomCriar(req);

//       // A fachada vai delegar a validação para a Strategy
//       const roomSalvo = await this.facade.create(roomDefinido);

//       res.status(201).json({
//         success: true,
//         message: "Quarto criado com sucesso",
//         room: roomSalvo,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         message: err.message,
//       });
//     }
//   }

//   private async definirRoomCriar(req: Request): Promise<Room> {
//     const {
//       roomCode,
//       type,
//       qntdAdultos,
//       qntdCriancas,
//       precoBase,
//       isActive = true,
//     } = req.body;

//     // A entidade Room já tem @BeforeInsert para gerar código se necessário
//     return new Room(
//       roomCode, // Pode ser undefined - a entidade gera automaticamente
//       type as RoomType,
//       qntdAdultos,
//       qntdCriancas,
//       precoBase,
//       isActive
//     );
//   }

//   private async definirRoomAtualizar(req: Request): Promise<Room> {
//     const { roomCode, type, qntdAdultos, qntdCriancas, precoBase, isActive } =
//       req.body;

//     return new Room(
//       roomCode,
//       type as RoomType,
//       qntdAdultos,
//       qntdCriancas,
//       precoBase,
//       isActive
//     );
//   }

//   private async definirRoomFiltrar(req: Request): Promise<Partial<Room>> {
//     const {
//       roomCode,
//       type,
//       qntdAdultos,
//       qntdCriancas,
//       precoMin,
//       precoMax,
//       isActive,
//     } = req.query;

//     const filters: any = {};

//     if (roomCode) filters.roomCode = roomCode as string;
//     if (type) filters.type = type as RoomType;
//     if (qntdAdultos) filters.qntdAdultos = parseInt(qntdAdultos as string);
//     if (qntdCriancas) filters.qntdCriancas = parseInt(qntdCriancas as string);
//     if (isActive !== undefined) filters.isActive = isActive === "true";

//     if (precoMin || precoMax) {
//       filters.precoMin = precoMin ? parseFloat(precoMin as string) : undefined;
//       filters.precoMax = precoMax ? parseFloat(precoMax as string) : undefined;
//     }

//     return filters;
//   }

//   public async buscarTodos(req: Request, res: Response): Promise<void> {
//     try {
//       const rooms = await this.facade.list(
//         new Room("", RoomType.single, 0, 0, 0, false),
//         "findAll"
//       );

//       res.status(200).json({
//         count: rooms.length,
//         rooms,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarDisponiveis(req: Request, res: Response): Promise<void> {
//     try {
//       const { dataInicio, dataFim, type, isActive = "true" } = req.query;

//       const searchCriteria: any = {
//         isActive: isActive === "true",
//       };

//       if (type) searchCriteria.type = type as RoomType;
//       if (dataInicio && dataFim) {
//         searchCriteria.dataInicio = new Date(dataInicio as string);
//         searchCriteria.dataFim = new Date(dataFim as string);
//       }

//       // Você precisará adicionar essa operação no DAO
//       const rooms = await this.facade.list(searchCriteria, "findAvailable");

//       res.status(200).json({
//         success: true,
//         count: rooms.length,
//         rooms,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarPorFiltro(req: Request, res: Response): Promise<void> {
//     try {
//       const filters = await this.definirRoomFiltrar(req);
//       // Usar 'findByFilters' que é o nome da operação no DAO
//       // Cast para Room para atender à assinatura da Facade
//       const rooms = await this.facade.list(filters as Room, "findByFilters");

//       res.status(200).json({
//         success: true,
//         count: rooms.length,
//         rooms,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarPorId(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;

//       const roomFiltro = new Room("", RoomType.single, 0, 0, 0, true);
//       roomFiltro.id = id;
//       const rooms = await this.facade.list(roomFiltro, "findById");

//       if (rooms.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Quarto não encontrado",
//         });
//         return;
//       }

//       res.status(200).json({
//         success: true,
//         room: rooms[0],
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarPorRoomCode(req: Request, res: Response): Promise<void> {
//     try {
//       const { roomCode } = req.params;
//       const roomFiltro = new Room("", RoomType.single, 0, 0, 0, true);
//       roomFiltro.roomCode = roomCode;
//       const rooms = await this.facade.list(roomFiltro, "findByFilters");

//       if (rooms.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Quarto não encontrado",
//         });
//         return;
//       }

//       res.status(200).json({
//         success: true,
//         room: rooms[0],
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarPorTipo(req: Request, res: Response): Promise<void> {
//     try {
//       const { type } = req.params;
//       const roomFiltro = new Room("", RoomType.single, 0, 0, 0, true);
//       roomFiltro.type = type as RoomType;
//       const rooms = await this.facade.list(roomFiltro, "findByFilters");

//       res.status(200).json({
//         success: true,
//         count: rooms.length,
//         rooms,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async atualizar(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;

//       const roomFiltro = new Room("", RoomType.single, 0, 0, 0, true);
//       roomFiltro.id = id;
//       const rooms = await this.facade.list(roomFiltro, "findById");

//       if (rooms.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Quarto não encontrado",
//         });
//         return;
//       }

//       const roomAtual = rooms[0];
//       const dadosAtualizacao = await this.definirRoomAtualizar(req);

//       // Mesclar os dados mantendo o ID
//       Object.assign(roomAtual, dadosAtualizacao);

//       // A fachada vai lidar com a validação via Strategy
//       const roomAtualizado = await this.facade.update(roomAtual);

//       res.status(200).json({
//         success: true,
//         message: "Quarto atualizado com sucesso",
//         room: roomAtualizado,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }

//   public async atualizarPreco(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;
//       const { precoBase } = req.body;

//       const roomFiltro = new Room("", RoomType.single, 0, 0, 0, true);
//       roomFiltro.id = id;
//       const rooms = (await this.facade.list(roomFiltro, "findById")) as Room[];

//       if (rooms.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Quarto não encontrado",
//         });
//         return;
//       }

//       const roomAtual = rooms[0] as Room;
//       roomAtual.precoBase = Number(precoBase);

//       const roomAtualizado = await this.facade.update(roomAtual);

//       res.status(200).json({
//         success: true,
//         message: `Preço do quarto atualizado para: R$ ${precoBase}`,
//         room: roomAtualizado,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async inativar(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;

//       const roomFiltro = new Room("", RoomType.single, 0, 0, 0, true);
//       roomFiltro.id = id;
//       const rooms = await this.facade.list(roomFiltro, "findById");
//       console.log(rooms);

//       if (rooms.length === 0) {
//         res.status(404).json({
//           success: false,
//           message: "Quarto não encontrado",
//         });
//         return;
//       }

//       const roomAtual = rooms[0];
//       roomAtual.isActive = false;

//       const roomAtualizado = await this.facade.update(roomAtual);

//       res.status(200).json({
//         success: true,
//         message: "Quarto inativado com sucesso",
//         room: roomAtualizado,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }

//   public async ativar(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;

//       const roomFiltro = new Room("", RoomType.single, 0, 0, 0, true);
//       roomFiltro.id = id;
//       const rooms = await this.facade.list(roomFiltro, "findById");
//       console.log(rooms);

//       if (rooms.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Quarto não encontrado",
//         });
//         return;
//       }

//       const roomAtual = rooms[0];
//       roomAtual.isActive = true;

//       const roomAtualizado = await this.facade.update(roomAtual);

//       res.status(200).json({
//         success: true,
//         message: "Quarto ativado com sucesso",
//         room: roomAtualizado,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }

//   public async getEstatisticas(_: Request, res: Response): Promise<void> {
//     try {
//       const rooms = (await this.facade.list({} as Room, "findAll")) as Room[];

//       const stats = {
//         total: rooms.length,
//         ativos: rooms.filter((r) => r.isActive).length,
//         inativos: rooms.filter((r) => !r.isActive).length,
//         porTipo: this.agruparPorTipo(rooms),
//         capacidadeMedia: this.calcularCapacidadeMedia(rooms),
//         precoMedio: this.calcularPrecoMedio(rooms),
//       };

//       res.status(200).json({
//         success: true,
//         stats,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   private agruparPorTipo(rooms: Room[]): { [tipo: string]: number } {
//     return rooms.reduce(
//       (acc, room) => {
//         const tipo = room.type;
//         acc[tipo] = (acc[tipo] || 0) + 1;
//         return acc;
//       },
//       {} as { [tipo: string]: number }
//     );
//   }

//   private calcularCapacidadeMedia(rooms: Room[]): number {
//     if (rooms.length === 0) return 0;
//     const totalCapacidade = rooms.reduce(
//       (sum, room) => sum + room.qntdAdultos + room.qntdCriancas,
//       0
//     );
//     return Number((totalCapacidade / rooms.length).toFixed(2));
//   }

//   private calcularPrecoMedio(rooms: Room[]): number {
//     if (rooms.length === 0) return 0;
//     const totalPreco = rooms.reduce((sum, room) => sum + room.precoBase, 0);
//     return Number((totalPreco / rooms.length).toFixed(2));
//   }

//   public async deletar(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;
//       const roomFiltro = new Room("", RoomType.single, 0, 0, 0, true);
//       roomFiltro.id = id;
//       const rooms = await this.facade.list(roomFiltro, "findById");

//       if (rooms.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Quarto não encontrado",
//         });
//         return;
//       }

//       const roomAtual = rooms[0];

//       await this.facade.delete(roomAtual);

//       res.status(200).json({
//         success: true,
//         message: "Quarto deletado com sucesso",
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }
// }

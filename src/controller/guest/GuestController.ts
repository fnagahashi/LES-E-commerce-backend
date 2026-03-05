import { Request, Response } from "express";
import Facade from "../../facade/Facade";
import Guest from "../../entities/client";
import Address from "../../entities/address";

export class GuestController {
  constructor(private readonly facade: Facade) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        dateBirth,
        cpf,
        phone,
        email,
        isActive = true,
        addresses = [],
      } = req.body;

      console.log(`👤 Criando hóspede: ${name}`);

      const guestAddresses = addresses.map(
        (addr: any) =>
          new Address(
            addr.cep,
            addr.street,
            addr.neighborhood,
            addr.number,
            addr.city,
            addr.state,
            addr.obs,
          ),
      );

      const guest = new Guest(
        name,
        dateBirth,
        cpf,
        phone,
        email,
        isActive,
        guestAddresses,
      );

      const guestCreated = await this.facade.create(guest);

      res.status(201).json({
        success: true,
        message: "Hóspede criado com sucesso",
        guest: guestCreated,
      });
    } catch (error: any) {
      console.error("❌ Erro ao criar hóspede:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const guestInstance = new Guest("", "", "", "", "", true, []);
      const guests = await this.facade.list(guestInstance, "findAll");

      res.json({
        success: true,
        count: guests.length,
        guests,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const guestInstance = new Guest("", "", "", "", "", true, []);
      (guestInstance as any).id = id;

      const guests = await this.facade.list(guestInstance, "findById");

      if (guests.length === 0) {
        res.status(404).json({ error: "Hóspede não encontrado" });
        return;
      }

      res.json({
        success: true,
        guest: guests[0],
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async findByCpf(req: Request, res: Response): Promise<void> {
    try {
      const { cpf } = req.params;
      const guestInstance = new Guest("", "", cpf, "", "", true, []);
      const guests = await this.facade.list(guestInstance, "findByCpf");

      if (guests.length === 0) {
        res.status(404).json({ error: "Hóspede não encontrado" });
        return;
      }

      res.json({
        success: true,
        guest: guests[0],
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const guestInstance = new Guest("", "", "", "", "", true, []);
      (guestInstance as any).id = id;
      const guests = await this.facade.list(guestInstance, "findById");

      if (guests.length === 0) {
        res.status(404).json({ error: "Hóspede não encontrado" });
        return;
      }

      const guest = guests[0];
      if (updateData.addresses && Array.isArray(updateData.addresses)) {
        updateData.addresses = updateData.addresses.map(
          (addr: any) =>
            new Address(
              addr.cep,
              addr.street,
              addr.neighborhood,
              addr.number,
              addr.city,
              addr.state,
              addr.obs,
            ),
        );
      }

      Object.assign(guest, updateData);
      const guestUpdated = await this.facade.update(guest);

      res.json({
        success: true,
        message: "Hóspede atualizado com sucesso",
        guest: guestUpdated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async inactivate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const guestInstance = new Guest("", "", "", "", "", true, []);
      (guestInstance as any).id = id;
      const guests = await this.facade.list(guestInstance, "findById");

      if (guests.length === 0) {
        res.status(404).json({ error: "Hóspede não encontrado" });
        return;
      }

      const guest = guests[0];
      guest.isActive = false;
      const guestUpdated = await this.facade.update(guest);

      res.json({
        success: true,
        message: "Hóspede inativado com sucesso",
        guest: guestUpdated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async activate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const guestInstance = new Guest("", "", "", "", "", false, []);
      (guestInstance as any).id = id;
      const guests = await this.facade.list(guestInstance, "findById");

      if (guests.length === 0) {
        res.status(404).json({ error: "Hóspede não encontrado" });
        return;
      }

      const guest = guests[0];
      guest.isActive = true;
      const guestUpdated = await this.facade.update(guest);

      res.json({
        success: true,
        message: "Hóspede ativado com sucesso",
        guest: guestUpdated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const guestInstance = new Guest("", "", "", "", "", true, []);
      (guestInstance as any).id = id;
      const guests = await this.facade.list(guestInstance, "findById");

      if (guests.length === 0) {
        res.status(404).json({ error: "Hóspede não encontrado" });
        return;
      }
      const guest = guests[0];
      await this.facade.delete(guest);

      res.json({
        success: true,
        message: "Hóspede deletado com sucesso",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: "Delete falhou: " + error.message,
      });
    }
  }
}

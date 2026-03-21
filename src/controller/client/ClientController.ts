import { Request, Response } from "express";
import Facade from "../../facade/Facade";
import Client from "../../entities/client";
import Address from "../../entities/address";
import CreditCard from "../../entities/creditCard";
import { Gender } from "../../enum/Gender";
import { sign } from "jsonwebtoken";

export class ClientController {
  constructor(private readonly facade: Facade) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        role,
        name,
        dateBirth,
        cpf,
        gender = Gender,
        phoneDDD,
        phoneNumber,
        phoneType,
        email,
        password,
        addresses = [],
        creditCard = [],
        isActive = true,
      } = req.body;

      console.log(`👤 Criando Cliente: ${name}`);

      const clientAddresses = addresses.map(
        (addr: Address) =>
          new Address(
            addr.typeResidence,
            addr.addressNickname,
            addr.typeStreet,
            addr.cep,
            addr.street,
            addr.neighborhood,
            addr.number,
            addr.city,
            addr.state,
            addr.country,
            addr.obs,
            addr.isDeliveryAddress,
            addr.isBillingAddress,
          ),
      );

      const clientCreditCard = creditCard.map(
        (card: CreditCard) =>
          new CreditCard(
            card.cardNumber,
            card.cardName,
            card.cardExpirationDate,
            card.cardHolderName,
            card.cardFlag,
            card.securityCode,
            card.isMainCard,
          ),
      );

      const client = new Client(
        role,
        name,
        dateBirth,
        cpf,
        gender,
        phoneDDD,
        phoneNumber,
        phoneType,
        email,
        password,
        clientAddresses,
        clientCreditCard,
        isActive,
      );

      const clientCreated = await this.facade.create(client);

      res.status(201).json({
        success: true,
        message: "Cliente cadastrado com sucesso",
        client: clientCreated,
      });
    } catch (error: any) {
      console.error("❌ Erro ao criar Cliente:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const clients = (await this.facade.findByFilters("Client", {
        email,
      } as Client)) as Client[];
      const client = clients[0];
      const { password: _, ...clientSafe } = client;

      if (!client) {
        res.status(401).json({
          success: false,
          message: "Email ou senha inválidos",
        });
        console.log("Login correto:", email, password);
        return;
      }

      const token = sign(
        {
          email: client.email,
          id: client.id,
          role: client.role,
        },
        "ecommerce",
        {
          expiresIn: "1d",
        },
      );

      res.json({
        success: true,
        token,
        user: clientSafe,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      console.log("facade:", this.facade);
      const clients = await this.facade.findAll("Client");
      console.log(`📋 Listando Clientes: ${clients.length} encontrados`);

      res.json({
        success: true,
        count: clients.length,
        clients,
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

      const client = await this.facade.findById("Client", id);

      if (!client) {
        res.status(404).json({
          success: false,
          message: "Cliente não encontrado",
        });
        return;
      }

      res.json({
        success: true,
        client,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async findByFilters(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;

      const clients = await this.facade.findByFilters("Client", filters);

      res.json({
        success: true,
        count: clients.length,
        clients,
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

      console.log(`🔄 Atualizando Cliente ID: ${id}`, updateData);

      const client = await this.facade.findById("Client", id);

      if (!client) {
        res.status(404).json({ error: "Cliente não encontrado" });
        return;
      }

      Object.assign(client, updateData);

      const clientUpdated = await this.facade.update(client);

      res.json({
        success: true,
        message: "Cliente atualizado com sucesso",
        client: clientUpdated,
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

      const client = (await this.facade.findById("Client", id)) as Client;

      if (!client) {
        res.status(404).json({ error: "Cliente não encontrado" });
        return;
      }
      client.isActive = false;

      const clientUpdated = await this.facade.update(client);

      res.json({
        success: true,
        message: "Cliente inativado com sucesso",
        client: clientUpdated,
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

      const client = (await this.facade.findById("Client", id)) as Client;

      if (!client) {
        res.status(404).json({ error: "Cliente não encontrado" });
        return;
      }

      client.isActive = true;
      const clientUpdated = await this.facade.update(client);

      res.json({
        success: true,
        message: "Cliente ativado com sucesso",
        client: clientUpdated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      const clientUpdated = await this.facade.changePassword(
        id,
        currentPassword,
        newPassword,
        confirmPassword,
      );

      res.status(200).json({
        success: true,
        message: "Senha alterada com sucesso",
        data: clientUpdated,
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

      const client = (await this.facade.findById("Client", id)) as Client;

      if (!client) {
        res.status(404).json({ error: "Cliente não encontrado" });
        return;
      }

      await this.facade.delete(client);

      res.json({
        success: true,
        message: "Cliente deletado com sucesso",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: "Delete falhou: " + error.message,
      });
    }
  }
  async deleteCreditCard(req: Request, res: Response): Promise<void> {
    try {
      const {id} = req.params;

      const creditCard = (await this.facade.findById("CreditCard", id)) as CreditCard;

      if (!creditCard) {
        res.status(404).json({ error: "Cartão de crédito não encontrado"});
        return;
      }

      await this.facade.delete(creditCard);

      res.json({
        success: true,
        message: "Cartão de crédito deletado com sucesso",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: "Delete falhou: " + error.message,
      });
    }
  }

  async deleteAddress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const address = (await this.facade.findById("Address", id)) as Address;

      if(!address) {
        res.status(404).json({error: "Endereço não encontrado"});
        return;
      }

      await this.facade.delete(address);

      res.json({
        success: true,
        message: "Endereço deletado com sucesso",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: "Delete falhou " + error.message,
      });
    }
  }
}

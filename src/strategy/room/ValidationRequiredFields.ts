import IStrategy from "../IStrategy";
import Room from "../../entities/room";

export default class ValidationRequiredRoomFields implements IStrategy<Room> {
  async executar(room: Room): Promise<string | undefined> {
    const errors: string[] = [];

    if (!room.type?.trim()) {
      errors.push("Tipo do quarto é obrigatório");
    }

    if (room.qntdAdultos === undefined || room.qntdAdultos === null) {
      errors.push("Capacidade de adultos é obrigatória");
    } else if (room.qntdAdultos < 1) {
      errors.push("Capacidade de adultos deve ser pelo menos 1 por quarto");
    }

    if (room.qntdCriancas === undefined || room.qntdCriancas === null) {
      errors.push("Capacidade de crianças é obrigatória");
    } else if (room.qntdCriancas < 0) {
      errors.push("Capacidade de crianças não pode ser negativa");
    }

    if (room.isActive === undefined || room.isActive === null) {
      errors.push("Status de atividade do quarto é obrigatório");
    }

    if (room.precoBase === undefined || room.precoBase === null) {
      errors.push("Preço base da diária é obrigatório");
    } else if (room.precoBase < 0) {
      errors.push("Preço base da diária não pode ser negativo");
    }

    if (room.type && this.isQuartoPadrao(room.type)) {
      if ((room.qntdAdultos || 0) > 2) {
        errors.push("Quartos padrão suportam no máximo 2 adultos");
      }
      if ((room.qntdCriancas || 0) > 2) {
        errors.push("Quartos padrão suportam no máximo 2 crianças");
      }
    }

    const capacidadeTotal = (room.qntdAdultos || 0) + (room.qntdCriancas || 0);
    if (capacidadeTotal > 10) {
      errors.push("Capacidade total do quarto não pode exceder 10 hóspedes");
    }

    return errors.length > 0 ? errors.join(", ") : undefined;
  }

  private isQuartoPadrao(tipo: string): boolean {
    const tiposPadrao = ["single", "double", "suite"];
    return tiposPadrao.includes(tipo.toLowerCase());
  }
}

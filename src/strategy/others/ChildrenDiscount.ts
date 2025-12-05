import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";

export default class ChildrenDiscountStrategy
  implements IStrategy<Reservation>
{
  async executar(reservation: Reservation): Promise<string | undefined> {
    if (!reservation.qntChildren || reservation.qntChildren === 0) {
      return undefined;
    }

    if (!reservation.childrenAges || reservation.childrenAges.length === 0) {
      return "Informe as idades das crianças";
    }

    const validacaoIdades = this.validarIdadesCriancas(
      reservation.childrenAges,
      reservation.qntChildren
    );

    if (validacaoIdades) {
      return validacaoIdades;
    }

    const criancasGratuitas = this.calcularCriancasGratuitas(
      reservation.childrenAges
    );

    if (criancasGratuitas > 0) {
      console.log(
        `🎉 ${criancasGratuitas} criança(s) até 5 anos não pagam diária`
      );

      const novoPrecoTotal = this.aplicarDescontoCriancas(reservation);

      if (novoPrecoTotal !== reservation.) {
        console.log(
          `💰 Desconto aplicado: R$ ${(reservation.payment.price - novoPrecoTotal).toFixed(2)}`
        );
        reservation.payment.price = novoPrecoTotal;
      }
    }

    return undefined;
  }

  private calcularCriancasGratuitas(childrenAges: number[]): number {
    return childrenAges.filter((idade) => idade <= 5).length;
  }

  private validarIdadesCriancas(
    childrenAges: number[],
    qntChildren: number
  ): string | undefined {
    if (childrenAges.length !== qntChildren) {
      return `Quantidade de idades (${childrenAges.length}) não corresponde à quantidade de crianças (${qntChildren})`;
    }

    const idadesInvalidas = childrenAges.filter(
      (idade) => idade < 0 || idade > 17
    );
    if (idadesInvalidas.length > 0) {
      return `Idades inválidas: ${idadesInvalidas.join(", ")}. Idades devem ser entre 0 e 17 anos`;
    }

    return undefined;
  }

  private aplicarDescontoCriancas(reservation: Reservation): number {
    const diarias = this.calcularDiarias(reservation);
    const diariaBase = reservation.payment.price / diarias;
    const criancasGratuitas = this.calcularCriancasGratuitas(
      reservation.childrenAges
    );

    const descontoTotal = diariaBase * criancasGratuitas;
    const novoPrecoTotal = reservation.payment.price - descontoTotal;

    return Math.max(novoPrecoTotal, 0);
  }

  public calcularDiarias(reservation: Reservation): number {
    const diffTime =
      reservation.dateEnd.getTime() - reservation.dateStart.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  obterDetalhesDesconto(reservation: Reservation): {
    criancasGratuitas: number;
    valorDesconto: number;
  } {
    const criancasGratuitas = this.calcularCriancasGratuitas(
      reservation.childrenAges
    );
    const diarias = this.calcularDiarias(reservation);
    const diariaBase = reservation.payment.price / diarias;
    const valorDesconto = diariaBase * criancasGratuitas;

    return { criancasGratuitas, valorDesconto };
  }
}

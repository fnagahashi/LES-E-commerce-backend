enum PaymentMethod {
    creditCard = "credit_card",
    debitCard = "debit_card",
    pix = "pix",
}

interface IPaymentRequest {
    id?: string;
    valor: string;
    formaPagamento: PaymentMethod;
    isPaid: boolean;
}

export { IPaymentRequest }
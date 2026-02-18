export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function calculateServiceFee(budget: number, feePercent: number = 10): number {
  return Math.round(budget * (feePercent / 100))
}

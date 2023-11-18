import type { OrderItem } from '../types/orders'

export function calculateValuePerCategory(
  category: number,
  items: OrderItem[]
) {
  let total = 0

  for (const item of items) {
    if (item.additionalInfo.categories.find((cat) => cat.id === category)) {
      total += item.priceDefinition.total
    }
  }

  return total
}

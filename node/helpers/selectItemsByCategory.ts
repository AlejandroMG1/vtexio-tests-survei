import type { OrderItem } from '../types/orders'

export function selectItemsByCategory(
  category: number,
  items: OrderItem[]
): OrderItem[] {
  return items.filter((item) =>
    item.additionalInfo.categories.find((cat) => cat.id === category)
  )
}

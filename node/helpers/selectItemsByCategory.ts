import type { OrderItem } from '../types/orders'

export function selectItemsByCategory(
  items: OrderItem[],
  category: number
): OrderItem[] {
  return items.filter((item) =>
    item.additionalInfo.categories.find((cat) => cat.id === category)
  )
}

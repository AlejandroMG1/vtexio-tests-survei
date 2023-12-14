import type { OrderItemDetailResponse } from '@vtex/clients/build/typings/oms'

export function calculateValuePerCategory(
  category: number,
  items: OrderItemDetailResponse[]
) {
  let total = 0

  for (const item of items) {
    const ids = item.additionalInfo.categoriesIds.split('/')

    if (ids.indexOf(`${category}`) !== -1) {
      total += item.priceDefinition.total as number
    }
  }

  return total
}

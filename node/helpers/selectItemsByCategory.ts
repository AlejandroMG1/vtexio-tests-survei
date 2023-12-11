import type { OrderItemDetailResponse } from '@vtex/clients/build/typings/oms'

export function selectItemsByCategory(
  category: number,
  items: OrderItemDetailResponse[]
): OrderItemDetailResponse[] {
  return items.filter((item) => {
    const ids = item.additionalInfo.categoriesIds.split('/')

    return ids.indexOf(`${category}`) !== -1
  })
}

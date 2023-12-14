import type { Order } from '../types/orders'
import { calculateValuePerCategory } from './calculateCategoryValue'
import { selectItemsByCategory } from './selectItemsByCategory'

export function sapRequestConstructor(
  orderData: Order,
  addOnsCategory: number,
  mainItemsCategory: number
) {
  const statusClass: { [key: string]: string } = {
    handling: 'ZTEC',
    'ready-for-handling': 'ZTCO',
    invoiced: 'ZTEO',
  }

  let shippingDate = ''

  try {
    shippingDate = orderData.shippingData.logisticsInfo[0].shippingEstimateDate
      .slice(0, 10)
      .split('-')
      .join('')
  } catch (error) {
        throw new Error('invalidDate')
  }

  const totalAddOns = calculateValuePerCategory(addOnsCategory, orderData.items)
  const mainItems = selectItemsByCategory(mainItemsCategory, orderData.items)
  const data = {
    Order: {
      Header: {
        Source: 'TOL',
        PurchaseOrder: orderData.orderId,
        OrderDate: orderData.creationDate.slice(0, 10).split('-').join(''),
        SoldTo: orderData.clientProfileData.document,
        ShipTo: orderData.sellers.join(','),
        DeliveryPreferenceDate: orderData.shippingData.logisticsInfo[0].shippingEstimateDate
          .slice(0, 10)
          .split('-')
          .join(''),
        FreightTerms: '01',
        TextDescriptive: 'NA',
        SalesDocCl: statusClass[orderData.status],
        IdSaleOrg: 'CO01',
        IdText: 'ZCE1',
        PayCondition: 'ANT',
      },
      Positions: {
        DeliveryDate: shippingDate,
        UOMSales: 'SC',
        totalAddOns,
        mainItems,
      },
    },
  }

  return data
}

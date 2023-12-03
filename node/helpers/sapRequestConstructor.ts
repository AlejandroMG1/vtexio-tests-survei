import type { Order } from '../types/orders'
import { calculateValuePerCategory } from './calculateCategoryValue'
import { selectItemsByCategory } from './selectItemsByCategory'

export async function sapRequestConstructor(
  orderData: Order,
  addOnsCategory: number,
  mainItemsCategory:number
) {
  const totalAddOns = calculateValuePerCategory(addOnsCategory,orderData.items)
  const mainItems = selectItemsByCategory(mainItemsCategory,orderData.items)
  const data = {
    Order: {
      Header: {
        Source: 'TOL',
        PurchaseOrder: orderData.orderId, // "12345",
        OrderDate: orderData.creationDate.slice(0, 10).split('-').join(''), // "20190918"
        SoldTo: orderData.clientProfileData.document, // IdCliente,              //"1009507", //codigo devuelto por SAP // buscar el Interlocutor que cumpla con condiciones IdOrgVentas = CO01 y IdFuncionInterloc =  AG
        ShipTo: orderData.sellers.join(','),
        DeliveryPreferenceDate: orderData.shippingData.logisticsInfo[0].shippingEstimateDate
          .slice(0, 10)
          .split('-')
          .join(''), // "20190905",
        FreightTerms: '01', // SIEMPRE VALOR 01
        TextDescriptive: 'NA', // Opcional
        SalesDocCl: 'ZCTO', // estatico
        IdSaleOrg: 'CO01', // estatico
        IdText: 'ZCE1', // estatico
        PayCondition: 'ANT', // Anticipado
      },
      Positions: {
        DeliveryDate: orderData.shippingData.logisticsInfo[0].shippingEstimateDate
          .slice(0, 10)
          .split('-')
          .join(''),
        UOMSales: 'SC',
        totalAddOns,
        mainItems
      },
    },
  }

  return data
}

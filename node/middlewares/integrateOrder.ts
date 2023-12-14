/* eslint-disable no-console */
import { json } from 'co-body'

import type { Order } from '../types/orders'
import { sapRequestConstructor } from '../helpers/sapRequestConstructor'

export async function integrateOrder(ctx: Context, next: () => Promise<any>) {


  try {
    const body = await json(ctx.req)
    const order = await oms.order(body.OrderId)

    if (!order) {
      throw new Error('invalid order')
    }

    const sapRequest = sapRequestConstructor(order, 1, 2)

    ctx.status = 200
    ctx.body = sapRequest

    await next()
  } catch (error) {
    switch (error.message) {
      case 'invalidDate':
        ctx.status = 400
        ctx.body = {
          message: 'invalid shipping date',
        }
        break

      case 'invalid order':
        ctx.status = 404
        ctx.body = {
          message: 'order not found',
        }
        break

      default:
        console.log('error', error)

        ctx.status = 500
        ctx.body = error?.data || error || { message: 'internal error' }
        break
    }
  }
}

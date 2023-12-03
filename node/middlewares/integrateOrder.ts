import { json } from 'co-body'

import type { Order } from '../types/orders'
import { sapRequestConstructor } from '../helpers/sapRequestConstructor'

export async function integrateOrder(ctx: Context, next: () => Promise<any>) {
  const body: Order = await json(ctx.req)

  try {
    const sapRequest = sapRequestConstructor(body, 1, 2)

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

      default:
        ctx.status = 500
        ctx.body = error?.data || error || { message: 'internal error' }
        break
    }
  }
}

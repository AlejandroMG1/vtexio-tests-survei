import { json } from 'co-body'

import type { Order } from '../types/orders'

export async function integrateOrder(ctx: Context, next: () => Promise<any>) {
  const body: Order = await json(ctx.req)

  console.info('Received body:', body.orderId)
  ctx.status = 200

  await next()
}

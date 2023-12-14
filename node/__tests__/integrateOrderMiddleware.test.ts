import { OMS } from '@vtex/clients'

import orders from './prebuildMoks/orders.json'
import { integrateOrder } from '../middlewares/integrateOrder'
import { MockIncomingMessage } from '../helpers/mockClass/MockIncomingMessage'

const mockOrders = orders

jest.mock('@vtex/clients', () => {
  return {
    __esModule: true,
    OMS: jest.fn().mockImplementation(() => {
      return {
        order: (OrderId: string) => {
          const selectedOrder = mockOrders.find(
            (order) => order.orderId === OrderId
          )
          return Promise.resolve(selectedOrder)
        },
      }
    }),
  }
})

describe('IntegrateMiddlewareFunctionality', () => {
  const MockedOMS = jest.mocked(OMS)

  it('contex shuld have data', async () => {
    const req = new MockIncomingMessage({
      method: 'POST',
    })

    req.write({
      OrderId: '1254030916485-01',
    })
    req.end()

    const ctx: any = {
      clients: {
        oms: new OMS({} as any),
      },
      req: {
        req,
      },
      status: 404,
      body: {},
    }

    await integrateOrder(ctx, () => Promise.resolve())

    expect(ctx.status).toBe(200)
    expect(MockedOMS).toHaveBeenCalledTimes(1)
  })
})

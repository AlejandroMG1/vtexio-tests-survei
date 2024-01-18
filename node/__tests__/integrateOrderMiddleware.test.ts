import { OMS } from '@vtex/clients'

import orders from '../test_tools/prebuildMoks/orders.json'
import { integrateOrder } from '../middlewares/integrateOrder'
import { MockIncomingMessage } from '../test_tools/mockClass/mockIncomingMessage'

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
  let req = new MockIncomingMessage({
    method: 'POST',
  })

  beforeEach(() => {
    jest.clearAllMocks()
    req = new MockIncomingMessage({
      method: 'POST',
    })
  })

  it('order found should have data', async () => {
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
    }

    await integrateOrder(ctx, () => Promise.resolve())

    expect(ctx.status).toBe(200)
    expect(ctx.body).toBeDefined()
    expect(MockedOMS).toHaveBeenCalledTimes(1)
  })

  it('order not found should res 404 and error message', async () => {
    req.write({
      OrderId: '1254030916485-02',
    })
    req.end()

    const ctx: any = {
      clients: {
        oms: new OMS({} as any),
      },
      req: {
        req,
      },
    }

    await integrateOrder(ctx, () => Promise.resolve())

    expect(ctx.status).toBe(404)
    expect(ctx.body.message).toBeDefined()

    expect(MockedOMS).toHaveBeenCalledTimes(1)
  })

  it('order without logisticInfo should res 400 and error message', async () => {
    req.write({
      OrderId: '1255030916486-01',
    })
    req.end()

    const ctx: any = {
      clients: {
        oms: new OMS({} as any),
      },
      req: {
        req,
      },
    }

    await integrateOrder(ctx, () => Promise.resolve())

    expect(ctx.status).toBe(400)
    expect(ctx.body.message).toBeDefined()

    expect(MockedOMS).toHaveBeenCalledTimes(1)
  })
})

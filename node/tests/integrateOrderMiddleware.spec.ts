import { OMS, OrderDetailResponse } from '@vtex/clients'

import orders from '../test_tools/prebuildMoks/orders.json'
import { integrateOrder } from '../middlewares/integrateOrder'
import { MockIncomingMessage } from '../test_tools/mockClass/mockIncomingMessage'
const sapRequestConstructor = require('../helpers/sapRequestConstructor')


const mockOrders:OrderDetailResponse[] = orders as unknown as OrderDetailResponse[]

describe('IntegrateMiddlewareFunctionality', () => {
    let omsSpy: any
    let req = new MockIncomingMessage({
        method: 'POST',
    })

    beforeEach(() => {
        if (omsSpy) {
            omsSpy.restore()
        }
        req = new MockIncomingMessage({
            method: 'POST',
        })
    })

    it('order found should have data', async () => {
        req.write({
            OrderId: '1254030916485-01',
        })
        req.end()
        const oms = new OMS({} as any)
        spyOn(oms, 'order').and.returnValue(Promise.resolve(mockOrders[0]))
        const ctx: any = {
            clients: {
                oms: oms,
            },
            req: {
                req,
            },
        }
        await integrateOrder(ctx, () => Promise.resolve())

        expect(ctx.status).toBe(200)
        expect(ctx.body).toBeDefined()
        expect(oms.order).toHaveBeenCalledTimes(1)
        //expect(MockedOMS).toHaveBeenCalledTimes(1)
    })

    it('order not found should res 404 and error message', async () => {
        req.write({
            OrderId: '1254030916485-02',
        })
        req.end()
        const oms = new OMS({} as any)
        spyOn(oms, 'order').and.returnValue(Promise.resolve(undefined as any))
        const ctx: any = {
            clients: {
                oms: oms,
            },
            req: {
                req,
            },
        }
        await integrateOrder(ctx, () => Promise.resolve())

        expect(ctx.status).toBe(404)
        expect(ctx.body).toBeDefined()
        expect(oms.order).toHaveBeenCalledTimes(1)
    })

    it('order without logisticInfo should res 400 and error message', async () => {
        req.write({
            OrderId: '1255030916486-01',
        })
        req.end()
        const oms = new OMS({} as any)
        spyOn(oms, 'order').and.returnValue(Promise.resolve(mockOrders[0]))
        spyOn(sapRequestConstructor, 'sapRequestConstructor').and.throwError('invalidDate')
        const ctx: any = {
            clients: {
                oms: oms,
            },
            req: {
                req,
            },
        }
        await integrateOrder(ctx, () => Promise.resolve())

        expect(ctx.status).toBe(400)
        expect(ctx.body).toBeDefined()
        expect(oms.order).toHaveBeenCalledTimes(1)
    })

    it('error should res 500 and error message', async () => {
        req.write({
            OrderId: '1255030916486-01',
        })
        req.end()
        const oms = new OMS({} as any)
        spyOn(oms, 'order').and.returnValue(Promise.resolve(new Error('error') as any))

        const ctx: any = {
            clients: {
                oms: oms,
            },
            req: {
                req,
            },
        }
        await integrateOrder(ctx, () => Promise.resolve())

        expect(ctx.status).toBe(500)
        expect(ctx.body).toBeDefined()
        expect(oms.order).toHaveBeenCalledTimes(1)
    })
})

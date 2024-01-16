import { OMS, OrderDetailResponse } from '@vtex/clients'
import { assert } from 'chai'
import { replace, spy, stub} from 'sinon'

import orders from '../test_tools/prebuildMoks/orders.json'
import { integrateOrder } from '../middlewares/integrateOrder'
import { MockIncomingMessage } from '../test_tools/mockClass/mockIncomingMessage'
const sapRequestConstructor = require('../helpers/sapRequestConstructor')


const mockOrders:OrderDetailResponse[] = orders as unknown as OrderDetailResponse[]

describe('IntegrateMiddlewareFunctionality', () => {
    let omsSpy: any
    let functionStub: any
    let req = new MockIncomingMessage({
        method: 'POST',
    })

    beforeEach(() => {
        if (omsSpy) {
            omsSpy.restore()
        }
        if (functionStub) {
            functionStub.restore()
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
        replace(oms, 'order', () => Promise.resolve(mockOrders[0]))
        const ctx: any = {
            clients: {
                oms: oms,
            },
            req: {
                req,
            },
        }

        omsSpy = spy(oms, 'order')
        await integrateOrder(ctx, () => Promise.resolve())

        assert.equal(ctx.status,200)
        assert.isDefined(ctx.body)
        assert.isTrue(omsSpy.calledOnce)
        //expect(MockedOMS).toHaveBeenCalledTimes(1)
    })

    it('order not found should res 404 and error message', async () => {
        req.write({
            OrderId: '1254030916485-02',
        })
        req.end()
        const oms = new OMS({} as any)
        replace(oms, 'order', () => Promise.resolve( undefined as any))
        const ctx: any = {
            clients: {
                oms: oms,
            },
            req: {
                req,
            },
        }

        omsSpy = spy(oms, 'order')
        await integrateOrder(ctx, () => Promise.resolve())

        assert.equal(ctx.status,404)
        assert.isDefined(ctx.body.message)
        assert.isTrue(omsSpy.calledOnce)
    })

    it('order without logisticInfo should res 400 and error message', async () => {
        req.write({
            OrderId: '1255030916486-01',
        })
        req.end()
        const oms = new OMS({} as any)
        replace(oms, 'order', () => Promise.resolve(mockOrders[0]))
        functionStub = stub(sapRequestConstructor, 'sapRequestConstructor').throws(new Error('invalidDate'))
        
        const ctx: any = {
            clients: {
                oms: oms,
            },
            req: {
                req,
            },
        }
        omsSpy = spy(oms, 'order')
        await integrateOrder(ctx, () => Promise.resolve())
        assert.equal(ctx.status,400)
        assert.isDefined(ctx.body.message)
        assert.isTrue(omsSpy.calledOnce)
    })

    it('error should res 500 and error message', async () => {
        req.write({
            OrderId: '1255030916486-01',
        })
        req.end()
        const oms = new OMS({} as any)
        replace(oms, 'order', () => Promise.reject(new Error('error')))

        const ctx: any = {
            clients: {
                oms: oms,
            },
            req: {
                req,
            },
        }
        omsSpy = spy(oms, 'order')
        await integrateOrder(ctx, () => Promise.resolve())

        assert.equal(ctx.status,500)
        assert.isDefined(ctx.body.message)
        assert.isTrue(omsSpy.calledOnce)
    })
})

/* eslint-disable jest/expect-expect */
import { OrderDetailResponse } from '@vtex/clients'
import {calculateValuePerCategory} from '../helpers/calculateCategoryValue'
import orders from '../test_tools/prebuildMoks/orders.json'
import { assert } from 'chai'


describe('Calculator Tests', () => {
  it('should return 5 when 2 is added to 3', () => {
    const [order] = (orders as unknown) as OrderDetailResponse[]

    const result = calculateValuePerCategory(22, order.items)
    result
    assert.equal(result, 0)
  })
})

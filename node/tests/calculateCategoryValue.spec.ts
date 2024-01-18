import type { OrderDetailResponse } from '@vtex/clients'

import { calculateValuePerCategory } from '../helpers/calculateCategoryValue'
import orders from '../test_tools/prebuildMoks/orders.json'

describe('calculateCategoryValueFunctionality', () => {
  it('non existing category should be 0', async () => {
    const [order] = (orders as unknown) as OrderDetailResponse[]

    const result = calculateValuePerCategory(22, order.items)

    expect(result).toBe(0)
  })

  it('existing category should return exact value', async () => {
    const [order] = (orders as unknown) as OrderDetailResponse[]

    const result = calculateValuePerCategory(1, order.items)

    expect(result).toBe(2932773)
  })

  it('existing sub category should return exact value', async () => {
    const [order] = (orders as unknown) as OrderDetailResponse[]

    const result = calculateValuePerCategory(20, order.items)
    expect(result).toBe(2932773)
  })
})

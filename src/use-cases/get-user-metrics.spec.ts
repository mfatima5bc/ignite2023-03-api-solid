import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should be able to get check-in count', async () => {
    await checkInRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    await checkInRepository.create({
      gym_id: 'gym_02',
      user_id: 'user_01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user_01',
    })

    expect(checkInsCount).toEqual(2)
  })
})

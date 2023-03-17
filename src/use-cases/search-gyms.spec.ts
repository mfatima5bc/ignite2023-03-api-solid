import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gym', async () => {
    await gymsRepository.create({
      id: 'gym_01',
      title: 'JavaScript gym',
      description: null,
      phone: null,
      latitude: -5.9916287,
      longitude: -42.5574303,
    })

    await gymsRepository.create({
      id: 'gym_02',
      title: 'TypeScript gym',
      description: null,
      phone: null,
      latitude: -5.9916287,
      longitude: -42.5574303,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript gym' })])
  })

  it('should be able to search paginated gyms by name', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript gym ${i}`,
        description: null,
        phone: null,
        latitude: -5.9916287,
        longitude: -42.5574303,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript gym 21' }),
      expect.objectContaining({ title: 'JavaScript gym 22' }),
    ])
  })
})

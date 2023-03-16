import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym_01',
      description: '',
      title: 'TDD gym',
      phone: '',
      latitude: -5.9867844,
      longitude: -42.5471236,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useFakeTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym_01',
      userId: 'user-01',
      userLatitude: -5.9867844,
      userLongitude: -42.5471236,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  /*
    Red (Vermelho): nesta fase, o desenvolvedor escreve um teste que deve falhar, ou seja, ele garante que o teste não passará sem implementar o código necessário.
    Green (Verde): aqui, o desenvolvedor escreve a quantidade mínima de código necessária para fazer o teste passar.
    Refactor (Refatorar): após o teste passar, o desenvolvedor refatora o código para melhorar a qualidade, sem alterar seu comportamento.

  */

  it('should not be possible to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym_01',
      userId: 'user-01',
      userLatitude: -5.9867844,
      userLongitude: -42.5471236,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym_01',
        userId: 'user-01',
        userLatitude: -5.9867844,
        userLongitude: -42.5471236,
      }),
    ).rejects.toBeInstanceOf(MaxNumberCheckInsError)
  })

  it('should be possible to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym_01',
      userId: 'user-01',
      userLatitude: -5.9867844,
      userLongitude: -42.5471236,
    })

    vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym_01',
      userId: 'user-01',
      userLatitude: -5.9867844,
      userLongitude: -42.5471236,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym_02',
      description: '',
      title: 'TDD gym',
      phone: '',
      latitude: new Decimal(-5.987027),
      longitude: new Decimal(-42.5551371),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym_02',
        userId: 'user-01',
        userLatitude: -5.9867844,
        userLongitude: -42.5471236,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

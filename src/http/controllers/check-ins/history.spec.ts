import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { createAndAuthenticateUse } from '@/utils/test/createAndAuthenticateUser'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the check-ins history', async () => {
    const { token } = await createAndAuthenticateUse(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Corpo em forma',
        latitude: -5.7532099,
        longitude: -43.0843786,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })
    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ])
  })
})

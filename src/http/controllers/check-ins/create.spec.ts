import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { createAndAuthenticateUse } from '@/utils/test/createAndAuthenticateUser'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create check ins (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check in', async () => {
    const { token } = await createAndAuthenticateUse(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Corpo em forma',
        latitude: -5.7532099,
        longitude: -43.0843786,
      },
    })
    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -5.7532099,
        longitude: -43.0843786,
      })

    expect(response.statusCode).toEqual(201)
  })
})

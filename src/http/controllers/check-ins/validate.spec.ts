import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { createAndAuthenticateUse } from '@/utils/test/createAndAuthenticateUser'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-ins', async () => {
    const { token } = await createAndAuthenticateUse(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Corpo em forma',
        latitude: -5.7532099,
        longitude: -43.0843786,
      },
    })

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })
    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUse } from '@/utils/test/createAndAuthenticateUser'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUse(app, true)

    const profileResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript gyms',
        description: 'Some description',
        phone: '119299292',
        latitude: -5.7532099,
        longitude: -43.0843786,
      })

    expect(profileResponse.statusCode).toEqual(201)
  })
})

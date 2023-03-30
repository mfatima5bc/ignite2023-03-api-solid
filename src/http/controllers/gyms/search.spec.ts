import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUse } from '@/utils/test/createAndAuthenticateUser'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUse(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Corpo em Forma',
        description: 'Some description',
        phone: '119999999',
        latitude: -5.7532099,
        longitude: -43.0843786,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gardi',
        description: 'Some description',
        phone: '119999991',
        latitude: -5.7532099,
        longitude: -43.0843786,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Corpo',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Corpo em Forma',
      }),
    ])
  })
})

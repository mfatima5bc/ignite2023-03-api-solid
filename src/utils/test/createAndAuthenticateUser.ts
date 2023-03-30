import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUse(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  const {
    body: { token },
  } = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  return {
    token,
  }
}

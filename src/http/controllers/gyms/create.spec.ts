import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })
    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)
        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Body Space',
                description: 'lorem ipsum',
                phone: '11999999999',
                latitude: -23.3780481,
                longitude: -46.6567397,
            })

        expect(response.statusCode).toEqual(201)
    })
})
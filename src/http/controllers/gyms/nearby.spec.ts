import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })
    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Body Space',
                description: 'lorem ipsum',
                phone: '11999999999',
                latitude: -23.5391,
                longitude: -46.8985, // less than 10 km from the user's location
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Smart Fit',
                description: 'lorem ipsum',
                phone: '11999999999',
                latitude: -23.3780481,
                longitude: -46.6567397,
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -23.5391,
                longitude: -46.8985,
            })
            .set('Authorization', `Bearer ${token}`)
            .send({})

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Body Space'
            })
        ])
    })
})
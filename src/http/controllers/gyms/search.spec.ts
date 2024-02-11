import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })
    it('should be able to search gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Body Space',
                description: 'lorem ipsum',
                phone: '11999999999',
                latitude: -23.3780481,
                longitude: -46.6567397,
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

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Performance',
                description: 'lorem ipsum',
                phone: '11999999999',
                latitude: -23.3780481,
                longitude: -46.6567397,
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'Body'
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
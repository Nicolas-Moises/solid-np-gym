import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })
    
    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Body Space',
            description: null,
            phone: null,
            latitude: -23.5391,
            longitude: -46.8985, // less than 10 km from the user's location
        })

        await gymsRepository.create({
            title: 'Smart Fit',
            description: null,
            phone: null,
            latitude: -23.3780481,
            longitude: -46.6567397,
        })

       
        const { gyms } = await sut.execute({
            userLatitude: -23.5391,
            userLongitude: -46.8985,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Body Space'}), // closest gym
        ])
    })
})

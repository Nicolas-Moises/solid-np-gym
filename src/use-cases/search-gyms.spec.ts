import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })
    
    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'Body Space',
            description: null,
            phone: null,
            latitude: -23.3780481,
            longitude: -46.6567397,
        })

        await gymsRepository.create({
            title: 'Smart Fit',
            description: null,
            phone: null,
            latitude: -23.3780481,
            longitude: -46.6567397,
        })

       
        const { gyms } = await sut.execute({
            query: 'Smart',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Smart Fit'}),
        ])
    })

    it('should be able to fetch paginated gym search', async () => {
        for(let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Smart Fit ${i}`,
                description: null,
                phone: null,
                latitude: -23.3780481,
                longitude: -46.6567397,
            })
  
        }
      
        const { gyms } = await sut.execute({
            query: 'Smart',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Smart Fit 21'}),
            expect.objectContaining({ title: 'Smart Fit 22'})
        ])
    })
})

import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Register Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)
        gymsRepository.items.push({
            id: 'gym-01',
            title: 'Academia Body Space',
            description: 'Rede',
            latitude: new Decimal(-23.5513716),
            longitude: new Decimal(-46.8931377),
            phone: ''
        })
        vi.useFakeTimers()
    })
    afterEach(() => {
        vi.useRealTimers()
    })
    it('should be able to check in', async () => {
        
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.5513716,
            userLongitude: -46.8931377
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice times in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.5513716,
            userLongitude: -46.8931377
        })

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.5513716,
            userLongitude: -46.8931377
        })).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice, but on different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.5513716,
            userLongitude: -46.8931377
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.5513716,
            userLongitude: -46.8931377
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })//,
})
import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsCaseUseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsCaseUseResponse {
    gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({ userLatitude, userLongitude }: FetchNearbyGymsCaseUseRequest): Promise<FetchNearbyGymsCaseUseResponse> {
        const gyms = await this.gymsRepository.findManyNearby({
            latitude: userLatitude, 
            longitude: userLongitude
        })

        return {
            gyms
        }
    }
}
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid()
    })
    const createCheckInBodySchema = z.object({
        latitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 180
        }),
    })

    const { gymId } = createCheckInParamsSchema.parse(request.params)
    const createCheckInUseCase = makeCheckInUseCase()

    const { 
        latitude, 
        longitude
    } = createCheckInBodySchema.parse(request.query)

  
    await createCheckInUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
        gymId,
        userId: request.user.sub
    })
    
    return reply.status(201).send()
}
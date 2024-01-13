import { expect, it, describe } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

// Unit test
describe('Register Use Case', () => {
    it('should hash user password upon registration', async () => {
       
        const registerUseCase = new RegisterUseCase({
            async findByEmail() {
                return null
            },
            async create(data) {
                return {
                    id: 'user-1',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date(),
                }
            }
        })
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john1@example.com',
            password: '123123'
        })

        const isPasswordCorrectlyHashed = await compare('123123', 
            user.password_hash,)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })
})
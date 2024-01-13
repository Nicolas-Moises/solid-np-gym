import { expect, it, describe } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// Unit test
describe('Register Use Case', () => {
    it('should be able to register', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123123'
        })

        expect(user.id).toEqual(expect.any(String))
    })
    it('should hash user password upon registration', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john1@example.com',
            password: '123123'
        })

        const isPasswordCorrectlyHashed = await compare('123123', 
            user.password_hash,)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'john1@example.com'
        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123123'
        })

        expect(() => registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123123'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
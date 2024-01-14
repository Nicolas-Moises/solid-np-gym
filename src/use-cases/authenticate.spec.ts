import { expect, it, describe } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

// Unit test
describe('Authenticate Use Case', () => {
    it('should be able to authenticate', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123123', 6)
        })
        // sut -> sysyem under test (principal variável)
        const { user } = await sut.execute({
            email: 'johndoe@example.com',
            password: '123123'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)
      
        // sut -> sysyem under test (principal variável)
        expect(() => sut.execute({
            email: 'johndoe@example.com',
            password: '123123'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123123', 6)
        })
        // sut -> sysyem under test (principal variável)
        expect(() => sut.execute({
            email: 'johndoe@example.com',
            password: '123121'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
    
})
import { expect, it, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase
// Unit test
describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
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
        // sut -> sysyem under test (principal variável)
        expect(() => sut.execute({
            email: 'johndoe@example.com',
            password: '123123'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
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
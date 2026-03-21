import { faker } from '@faker-js/faker'
import { IRegisterUserRequest } from 'data/types/register.types'

export function generateUserData(): IRegisterUserRequest {
  return {
    username: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
    language: 'en',
  }
}

import { ICredentials } from '../../data/types/credentials.types'

export const BASE_URL = process.env.BASE_URL
export const API_URL = process.env.API_URL
export const credentials: ICredentials = {
  username: process.env.USER_NAME!,
  userEmail: process.env.USER_EMAIL!,
  password: process.env.USER_PASSWORD!,
}

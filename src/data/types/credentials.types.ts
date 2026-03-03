import { IResponseFields } from './core.types'

export interface ICredentials {
  username: string
  userEmail: string
  password: string
}

export interface ILoginResponse extends IResponseFields {
  token: string
}

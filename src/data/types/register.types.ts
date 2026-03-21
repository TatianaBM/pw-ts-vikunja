import { ICredentials } from 'data/types/credentials.types'
import { IResponseError } from 'data/types/core.types'

export interface IRegisterUserRequest extends ICredentials {
  language: string
}

export interface IRegisterUserSuccessResponse {
  created: string
  email: string
  id: number
  name: string
  updated: string
  username: string
}

export type IRegisterResponse = IRegisterUserSuccessResponse | IResponseError

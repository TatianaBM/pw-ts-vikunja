import { ICredentials } from 'data/types/credentials.types'
import { IResponseError } from 'data/types/core.types'

export interface ILoginRequest extends Pick<
  ICredentials,
  'username' | 'password'
> {
  long_token: boolean
  totp_passcode?: string
}

export interface ILoginSuccessResponse {
  token: string
}

export type ILoginResponse = ILoginSuccessResponse | IResponseError

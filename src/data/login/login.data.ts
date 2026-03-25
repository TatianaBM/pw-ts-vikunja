import { ICredentials } from 'data/types/credentials.types'
import { ILoginRequest } from 'data/types/login.types'

export const loginOptions: (keyof ICredentials)[] = ['username', 'email']

export const longTokenOptions: ILoginRequest['long_token'][] = [true, false]

export const requiredLoginFields: (keyof Omit<
  ILoginRequest,
  'totp_passcode'
>)[] = ['username', 'password', 'long_token']

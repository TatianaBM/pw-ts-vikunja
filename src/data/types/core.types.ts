export interface IResponseFields {
  IsSuccess: boolean
  ErrorMessage: string | null
}

export interface IResponse<T extends object | null> {
  status: number
  headers: Record<string, string>
  body: T
}

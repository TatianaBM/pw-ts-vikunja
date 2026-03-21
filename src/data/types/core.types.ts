// define Base response type, where response body is an object
export interface IResponse<T extends object> {
  status: number
  headers: Record<string, string>
  body?: T
}

export interface IResponseError {
  code?: number
  message: string
}

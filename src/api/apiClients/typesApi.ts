// Define types for the request, response, as well as define the type for the send() method  (api request)
// Record<string, string> means an object where: keys are strings, values are strings
export interface IRequestOptions {
  baseUrl: string
  url: string
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  data?: object
  headers?: Record<string, string>
}

// The body type will be decided later, but it must be either an object or null
export interface IResponse<T extends object | null> {
  status: number
  headers: Record<string, string>
  body: T
}

// T extends object | null => what type the response body will be
// options => The method takes one parameter
// Promise<IResponse<T> => what our method returns
export interface IApiClient {
  send<T extends object | null>(options: IRequestOptions): Promise<IResponse<T>>
}

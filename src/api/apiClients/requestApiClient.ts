import {
  test,
  APIRequestContext,
  APIResponse,
  TestStepInfo,
} from '@playwright/test'
import { BaseApiClient } from 'api/apiClients/baseApiClient'
import { IRequestOptions, IResponse } from 'api/apiClients/typesApi'
import _ from 'lodash'

export class PlaywrightApiClient extends BaseApiClient {
  constructor(private requestContext: APIRequestContext) {
    super()
  }

  // APIResponse class represents responses returned by apiRequestContext.get() and similar methods
  private response: APIResponse | undefined

  // send() method implementation
  // sends HTTP requests via requestContext.fetch()
  async send<T extends object>(
    options: IRequestOptions,
  ): Promise<IResponse<T>> {
    return await test.step(`Request ${options.method.toUpperCase()} ${options.url}`, async (step) => {
      try {
        await this.attachRequest(options, step)
        // fetch Sends HTTP(S) request and returns its response, returns promise APIResponse
        this.response = await this.requestContext.fetch(
          // Target URL
          options.baseUrl + options.url,
          // options Object (optional)
          // omit returns the new object with properties that are not ommited
          _.omit(options, ['baseUrl', 'url']),
        )
        // Parse the response into IResponse<...> format (transformResponse)
        const result = await this.transformResponse()
        // Attach response to the report
        await this.attachResponse(options, result, step)
        return result
      } catch (err) {
        console.log('Error message: ' + (err as Error).message)
        console.log('Cause ' + JSON.stringify((err as Error).cause))
        // Attach the error to the step in the report
        await step.attach('Error', {
          body: String(err),
          contentType: 'text/plain',
        })
        throw err
      }
    })
  }

  // normalize Playwright response to IResponse
  // protected => means method can be called inside PlaywrightApiClient, in subclasses
  protected async transformResponse() {
    let body
    // add ! (non-null assertion) (response!) to tell ts 'trust me, it’s not undefined here'
    const contentType = this.response!.headers()['content-type'] || ''
    if (contentType.includes('application/json')) {
      // json() Returns the JSON representation of response body
      body = await this.response!.json()
    } else {
      // text() Returns the text representation of response body (string)
      body = await this.response!.text()
    }
    return {
      status: this.response!.status(),
      body,
      headers: this.response!.headers(),
    }
  }

  // Attach artifacts to the test report - request
  // TestStepInfo contains information about currently running test step
  private async attachRequest(options: IRequestOptions, step: TestStepInfo) {
    await step.attach(
      `Request details for: Request ${options.method.toUpperCase()} ${options.url}`,
      {
        body: JSON.stringify(
          // JSON.stringify(value, replacer, space), here i do not have custom replacer, Indent with 2 spaces to control spacing in the final string
          {
            requestUrl: options.baseUrl + options.url,
            headers: options.headers,
            // ensure no empty body field when there's no request body
            // if options.data ist true, returns second operand { body: options.data }
            // if options.data is false, returns first operand (undefined or null or '') => so body would not be included
            ...(options.data && { body: options.data }),
          },
          null,
          2,
        ),
        // Render this attachment as JSON
        contentType: 'application/json',
      },
    )
  }

  // attach artifacts to the test report - response
  private async attachResponse<T extends object>(
    options: IRequestOptions,
    response: IResponse<T>,
    step: TestStepInfo,
  ) {
    await step.attach(
      `Response details for: Request ${options.method.toUpperCase()} ${options.url}`,
      {
        body: JSON.stringify(
          {
            headers: response.headers,
            body: response.body,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      },
    )
  }
}

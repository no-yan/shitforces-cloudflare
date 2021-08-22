import { corsHeaders } from './index'

export function handleOptions(request: any): Response {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  const headers = request.headers
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    interface RHeaders {
      'Access-Control-Allow-Headers': string
      'Access-Control-Expose-Headers': string
      'Access-Control-Allow-Credentials'?: string
      'Access-Control-Allow-Origin'?: string
      'Access-Control-Allow-Methods'?: string
      'Access-Control-Max-Age'?: string
    }
    const respHeaders: RHeaders = {
      'Access-Control-Expose-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': request.headers.get(
        'Access-Control-Request-Headers',
      ),
      ...corsHeaders,
      'Access-Control-Max-Age': '0',

      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
    }
    // if (request.headers.get('credentials') !== 'include') {
    //   delete respHeaders['Access-Control-Allow-Credentials']
    // }
    const response = new Response(null, {
      headers: respHeaders as unknown as HeadersInit,
    })

    // if (request.credentials === 'include') {
    //   response.headers.set('Access-Control-Allow-Credentials', 'true')
    // }
    return response
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
}

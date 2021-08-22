// import { handleRequest } from './handler'
import { Router } from 'itty-router'
import { handleOptions } from './handleOptions'

// Create a new router
const router = Router()

// https://myapp.noyan.workers.dev/api/account/hoge
router.get('/api/account/:user', async ({ params }) => {
  // Return the HTML with the string to the client
  const user = decodeURIComponent(params?.user || '')
  const data = await fetch(
    `https://young-basin-03851.herokuapp.com/api/account/${user}`,
    {
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: { '200-299': 100, 404: 1, '500-599': 0 },
      },
    },
  )
  const response = new Response(data.body, data)
  response.headers.set('Cache-Control', 'max-age=1500')
  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://young-basin-03851.herokuapp.com',
  )

  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://young-basin-03851.herokuapp.com',
  )
  response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
})

// https://myapp.noyan.workers.dev/api/contests/latest?contest_page=0
router.get('/api/contests/latest?', async ({ query }: any) => {
  // eslint-disable-next-line camelcase
  const { contest_page } = query
  const data = await fetch(
    // eslint-disable-next-line camelcase
    `https://young-basin-03851.herokuapp.com/api/contests/latest?contest_page=${contest_page}`,
    { cf: { cacheEverything: true } },
  )
  const response = new Response(data.body, data)
  response.headers.set('Cache-Control', 'max-age=1500')
  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://young-basin-03851.herokuapp.com',
  )
  return response
})

router.get('/api/account/:user/history', async ({ params }: any) => {
  // Return the HTML with the string to the client
  const user = decodeURIComponent(params.user)
  const data = await fetch(
    `https://young-basin-03851.herokuapp.com/api/account/${user}/history`,
    {
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: { '200-299': 100, 404: 1, '500-599': 0 },
      },
    },
  )
  const response = new Response(data.body, data)
  response.headers.set('Cache-Control', 'max-age=15')
  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://young-basin-03851.herokuapp.com',
  )
  return response
})
// http://127.0.0.1:8787/api/account/noyan
// https://myapp.noyan.workers.dev/api/account/noyan

router.get('/api/ranking?', ({ query }: any) => {
  const { page } = query
  return fetch(
    `https://young-basin-03851.herokuapp.com/api/ranking?page=${page}`,
    {
      cf: { cacheEverything: true },
    },
  )
})

router.get('/', () => {
  return new Response('Successfully published!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://young-basin-03851.herokuapp.com',
    },
  })
})

/*
This shows a different HTTP method, a POST.

Try send a POST request using curl or another tool.

Try the below curl command to send JSON:

$ curl -X POST <worker> -H "Content-Type: application/json" -d '{"abc": "def"}'
*/
// router.post('/post', async (request) => {
//     // Create a base object with some fields.
//     const fields = {
//         asn: request.cf.asn,
//         colo: request.cf.colo,
//     };

//     // If the POST data is JSON then attach it to our response.
//     if (request.headers.get('Content-Type') === 'application/json') {
//         fields.json = await request.json();
//     }

//     // Serialise the JSON to a string.
//     const returnData = JSON.stringify(fields, null, 2);

//     return new Response(returnData, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
// });

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all('*', () => new Response('404, not found!', { status: 404 }))

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/

export const corsHeaders: HeadersInit = {
  'Access-Control-Allow-Origin': 'https://young-basin-03851.herokuapp.com',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
}

addEventListener('fetch', (event) => {
  if (event.request.method === 'OPTIONS') {
    event.respondWith(handleOptions(event.request))
  } else {
    event.respondWith(router.handle(event.request))
  }
})

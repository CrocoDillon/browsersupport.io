import { InputError } from '@browsersupport/data/validation'
export async function readJson(request: Request) {
  const body = await request.text()
  if (Buffer.byteLength(body, 'utf8') > 2 * 1024 * 1024)
    throw new InputError('Request is limited to 2 MB')
  try {
    return JSON.parse(body)
  } catch {
    throw new InputError('Invalid JSON')
  }
}
export function failure(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof InputError
          ? error.message
          : 'The lab could not reach the database',
    },
    { status: error instanceof InputError ? 400 : 503 }
  )
}

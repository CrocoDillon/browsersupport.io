import { NextResponse, type NextRequest } from 'next/server'
export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || ''
  if (!/^(127\.0\.0\.1|localhost):3001$/.test(host))
    return new NextResponse('The lab is only available on localhost:3001', {
      status: 403,
    })
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const origin = request.headers.get('origin')
    if (!origin || origin !== 'http://' + host)
      return new NextResponse('Local same-origin requests only', {
        status: 403,
      })
  }
  return NextResponse.next()
}

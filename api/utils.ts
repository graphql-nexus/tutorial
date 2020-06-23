import { verify } from 'jsonwebtoken'
import { Request } from 'nexus/dist/runtime/schema/schema'

export const APP_SECRET = 'nexus-tutorial'

export function getUserId(request: Request): number | null {
  const authorization = request.headers['authorization']

  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as { userId: number }

    return verifiedToken.userId
  }

  return null
}

export function mustBeLoggedIn(userId: number | null) {
  if (!userId) {
    return new Error('You must be logged in')
  } else {
    return true
  }
}

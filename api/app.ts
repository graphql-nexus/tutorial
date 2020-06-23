import { use, schema } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import { getUserId } from './utils'

use(prisma())

schema.addToContext(request => {
  return {
    request,
    userId: getUserId(request)
  }
})

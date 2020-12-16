import { PrismaClient } from '@prisma/client'
import { db } from './db'

export interface Context {
  db: PrismaClient
}

export const context = {
  db,
}

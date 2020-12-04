import { PrismaClient } from '@prisma/client'
import { db } from './db'

export interface Context {
  db: PrismaClient
}

export function createContext(): Context {
  return {
    db,
  }
}

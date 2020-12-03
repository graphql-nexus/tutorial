import { PrismaClient } from '@prisma/client'

export interface Context {
  db: PrismaClient
}

export function createContext(): Context {
  return {
    db: new PrismaClient(),
  }
}

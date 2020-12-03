import { ApolloServer } from 'apollo-server'
import { createContext } from './context'
import { schema } from './schema'

export const server = new ApolloServer({
  schema,
  context: createContext,
})

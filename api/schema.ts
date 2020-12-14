import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './graphql'

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
  },
  contextType: {
    module: join(__dirname, './context.ts'),
    export: 'Context'
  },
})

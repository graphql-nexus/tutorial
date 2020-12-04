import { makeSchema } from '@nexus/schema'
import { join } from 'path'
import * as types from './graphql'

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
    schema: join(__dirname, '../schema.graphql'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: join(__dirname, './context.ts'), // 1
        alias: 'ContextModule', // 2
      },
    ],
    contextType: 'ContextModule.Context', // 3
  },
})

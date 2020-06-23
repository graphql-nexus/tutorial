import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { schema } from 'nexus'
import { APP_SECRET } from '../utils'

schema.objectType({
  name: 'User',
  definition(t) {
    t.list.field('drafts', {
      type: 'Post',
      resolve(_parent, _args, ctx) {
        return ctx.db.post.findMany({
          where: { published: false, author: { id: ctx.userId! } },
        })
      },
    })
  },
})

schema.objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.db.user.create({
          data: {
            email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        const user = await ctx.db.user.findOne({
          where: {
            email,
          },
        })

        if (!user) {
          throw new Error(`Invalid email or password`)
        }

        const passwordValid = await compare(password, user.password)

        if (!passwordValid) {
          throw new Error(`Invalid email or password`)
        }

        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })
  },
})

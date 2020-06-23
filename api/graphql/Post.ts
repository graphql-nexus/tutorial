import { schema } from 'nexus'
import { mustBeLoggedIn } from '../utils'

schema.objectType({
  name: 'Post',
  nonNullDefaults: {
    output: true,
  },
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('body')
    t.boolean('published')
  },
})

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('viewer', {
      type: 'User',
      authorize(_root, _args, ctx) {
        return mustBeLoggedIn(ctx.userId)
      },
      resolve(_root, _args, ctx) {
        return ctx.db.user.findOne({ where: { id: ctx.userId! } })
      },
    })

    t.list.field('posts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: true } })
      },
    })
  },
})

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDraft', {
      type: 'Post',
      args: {
        title: schema.stringArg({ required: true }),
        body: schema.stringArg({ required: true }),
      },
      authorize(_root, _args, ctx) {
        return mustBeLoggedIn(ctx.userId)
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.create({
          data: {
            title: args.title,
            body: args.body,
            published: false,
            author: { connect: { id: ctx.userId! } },
          },
        })
      },
    })

    t.field('publish', {
      type: 'Post',
      args: {
        draftId: schema.intArg({ required: true }),
      },
      async authorize(_parent, args, ctx) {
        const isLoggedIn = mustBeLoggedIn(ctx.userId)

        if (isLoggedIn !== true) {
          return isLoggedIn
        }

        const existingDraft = await ctx.db.post.findOne({
          where: { id: args.draftId },
          include: { author: true },
        })

        if (!existingDraft || existingDraft.author.id !== ctx.userId) {
          return new Error('no such draft to publish')
        }

        return true
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: { id: args.draftId },
          data: {
            published: true,
          },
        })
      },
    })
  },
})

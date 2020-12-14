import {
  extendType,
  intArg,
  interfaceType,
  nonNull,
  objectType,
  stringArg
} from 'nexus'

export const Media = interfaceType({
  name: 'Media',
  resolveType(source) {
    return 'director' in source ? 'Movie' : 'Song'
  },
  definition(t) {
    t.string('url')
  },
})
export const Movie = objectType({
  name: 'Movie',
  definition(t) {
    t.implements('Media')
    t.string('director')
  },
})
export const Song = objectType({
  name: 'Song',
  definition(t) {
    t.implements('Media')
    t.string('album')
  },
})

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('body')
    t.boolean('published')
  },
})

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('drafts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: false } })
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

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDraft', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const draft = {
          title: args.title,
          body: args.body,
          published: false,
        }
        return ctx.db.post.create({ data: draft })
      },
    })

    t.field('publish', {
      type: 'Post',
      args: {
        draftId: nonNull(intArg()),
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: {
            id: args.draftId,
          },
          data: {
            published: true,
          },
        })
      },
    })
  },
})

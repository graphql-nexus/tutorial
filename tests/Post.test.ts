import { createTestContext } from './__helpers'
const ctx = createTestContext()
it('ensures that a draft can be created and published', async () => {
  // Create a new draft
  const draftResult = await ctx.client.request(`
    mutation {
      createDraft(title: "Nexus", body: "...") {
        id
        title
        body
        published
      }
    }
  `)
  // Snapshot that draft and expect `published` to be false
  expect(draftResult).toMatchInlineSnapshot(`
    Object {
      "createDraft": Object {
        "body": "...",
        "id": 19,
        "published": false,
        "title": "Nexus",
      },
    }
  `) // 3
  // Publish the previously created draft
  const publishResult = await ctx.client.request(
    `
    mutation publishDraft($draftId: Int!) {
      publish(draftId: $draftId) {
        id
        title
        body
        published
      }
    }
  `,
    { draftId: draftResult.createDraft.id }
  )
  // Snapshot the published draft and expect `published` to be true
  expect(publishResult).toMatchInlineSnapshot(`
    Object {
      "publish": Object {
        "body": "...",
        "id": 19,
        "published": true,
        "title": "Nexus",
      },
    }
  `)

  const persistedData = await ctx.db.post.findMany()

  expect(persistedData).toMatchInlineSnapshot(`
    Array [
      Object {
        "body": "...",
        "id": 1,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 2,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 3,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 4,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 5,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 6,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 7,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 8,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 9,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 10,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 11,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 12,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 13,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 14,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 15,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 16,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 17,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 18,
        "published": true,
        "title": "Nexus",
      },
      Object {
        "body": "...",
        "id": 19,
        "published": true,
        "title": "Nexus",
      },
    ]
  `)
})

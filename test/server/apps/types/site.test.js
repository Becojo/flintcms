const mocks = require('../../../mocks')
const common = require('../common')
const mongoose = require('mongoose')

describe('Site', () => {
  let agent

  beforeAll(async () => {
    agent = await common.before()
  })

  afterAll(() => mongoose.disconnect())

  it('returns the site config', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        {
          site {
            siteName
            siteUrl
            style
          }
        }`
      })
    expect(res.body).toEqual({
      data: {
        site: {
          siteName: mocks.site[0].siteName,
          siteUrl: mocks.site[0].siteUrl,
          style: mocks.site[0].style
        }
      }
    })
  })

  it('updates the site document', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `mutation ($data: SiteInput!) {
          updateSite (data: $data) {
            siteName
          }
        }`,
        variables: {
          data: {
            siteName: 'New site name'
          }
        }
      })
    expect(res.body).toEqual({
      data: {
        updateSite: {
          siteName: 'New site name'
        }
      }
    })
  })

  describe('Permissions', () => {
    beforeAll(async () => common.setNonAdmin(agent))

    it('cannot update the site document', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `mutation ($data: SiteInput!) {
            updateSite (data: $data) {
              siteName
              siteUrl
              style
            }
          }`,
          variables: {
            data: {
              siteName: 'New site name'
            }
          }
        })
      expect(res.body.errors[0]).toMatchObject({
        message: 'You do not have permission to manage site configuration.'
      })
    })

    afterAll(common.setAdmin)
  })
})

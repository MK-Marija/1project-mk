const { expect } = require("@jest/globals")
const request = require("supertest")
const app = require(`${__dirname}/../api/app`)
const db = require(`${__dirname}/../db/connection`)
const seed = require(`${__dirname}/../db/seeds/seed`)
const testData = require(`${__dirname}/../db/data/test-data`)

beforeEach(() => {
   return seed(testData)
})


afterAll(() => {
    return db.end()
})


describe("GET/ api/topics", () => {
    test("200: returns an object with a key of topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty("topics")).toBe(true);
        })
    })

    test("200: returns an array of objects with the properties slug and desciption", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBeGreaterThan(1)
            expect(Array.isArray(body.topics)).toBe(true)
            body.topics.forEach(topic => {
                expect(topic).toEqual(expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String) }) )

                })

         })
    
 })

})
    
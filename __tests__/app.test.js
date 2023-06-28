const { expect } = require("@jest/globals")
const request = require("supertest")
const app = require(`${__dirname}/../api/app`)
const db = require(`${__dirname}/../db/connection`)
const seed = require(`${__dirname}/../db/seeds/seed`)
const testData = require(`${__dirname}/../db/data/test-data`)
const data = require(`${__dirname}/../endpoints.json`)


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

describe("GET/ api/ ", () => {
    test("200: returns an object describing all the available endpoints ", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
             expect(body).toEqual(data);
        })
    })

})

describe("GET/ api/articles/:article_id", () => {
    test("200: returns an articles object with relevant properties ", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
             expect(body.articles).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
             });
        })
    })

    test("400: Returns error msg 'Bad request' when bad request is made example NaN", () => {
        return request(app)
        .get("/api/articles/bad")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request");
        })
    })

test("404: Returns 'Not found' when article_id is valid(as data type) but does not exist", () => {
    return request(app)
    .get("/api/articles/88")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not found");
    })
})

})
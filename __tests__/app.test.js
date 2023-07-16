const { expect } = require("@jest/globals")
const request = require("supertest")
const app = require(`${__dirname}/../api/app`)
const db = require(`${__dirname}/../db/connection`)
const seed = require(`${__dirname}/../db/seeds/seed`)
const testData = require(`${__dirname}/../db/data/test-data`)
const data = require(`${__dirname}/../endpoints.json`)
jest.setTimeout(10000);


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

describe("GET/ api/articles", () => {
    test("200: makes sure the array is not empty and returns the articles sorted by desc date", () => {
        return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({body}) => {
            const {articles} = body
          
            expect(articles.length).toBeGreaterThan(0)
            expect(Array.isArray(articles)).toBe(true)
            expect(articles).toBeSortedBy(Number("created_at"));
            expect(articles).toBeSortedBy("created_at", {descending: true})
            articles.forEach((article) => {
                expect(article).toHaveProperty("article_id", expect.any(Number));
                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty("topic", expect.any(String));
                expect(article).toHaveProperty("created_at", expect.any(String));
                expect(article).toHaveProperty("votes", expect.any(Number));
                expect(article).toHaveProperty("votes", expect.any(Number));
                expect(article).toHaveProperty("article_img_url", expect.any(String));
                expect(article).toHaveProperty("comment_count", expect.any(String));
                })
            })
        })
     
    

     test("400: Responds'Bad request'for an invalid sort_by", () => {
        return request(app)
        .get("/api/articles/?sort_by=creed_at")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request");
        })
    })

test("404: Returns custom error message ", () => {
    return request(app)
    .get("/api/notapath")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not found");
    })
})
})

describe("GET/ api/articles/:article_id/comments", () => {
    test("200: makes sure it responds with an array of objects ", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments.length).toBe(11)
            expect(Array.isArray(comments)).toBe(true)
            comments.forEach((comment) => {
                expect(comment).toBeObject();
            })
          })
        })
    

        test("200: makes sure it responds with the correct properties with the most recent comments first", () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({body}) => {
                const {comments} = body
                expect(comments).toBeSortedBy("created_at", {descending: true})

                comments.forEach((comment) => {
                expect(comment).toHaveProperty("article_id", expect.any(Number));
                expect(comment).toHaveProperty("comment_id", expect.any(Number));
                expect(comment).toHaveProperty("author", expect.any(String));
                expect(comment).toHaveProperty("body", expect.any(String));
                expect(comment).toHaveProperty("votes", expect.any(Number))
                })       
             })
              })


              test("404: responds with message' Not found' when passed a non existing ID", () => {
                return request(app)
                .get("/api/articles/88/comments")
                .expect(404)
                .then(({body}) => {
                  expect(body.msg).toBe("Not found");
                })
        })

              test("400:  Responds with msg 'Bad request' when passed an invalid id format", () => {
              return request(app)
              .get("/api/articles/one/comments")
              .expect(400)
              .then(({body}) => {
               expect(body.msg).toBe("Bad request");
            })
        })
    })

describe("POST /api/articles/:article_id/comments", () => {
    test("201: a new comment has been posted ", () => {
        const comment = {
            article_id: 1,
            username: "butter_bridge",
            body: "Veni,vidi,vici"
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(201)
        .then(({body}) => {
        
  
       expect(body.comment).toHaveProperty("article_id", expect.any(Number))
       expect(body.comment).toHaveProperty("author", expect.any(String))
       expect(body.comment).toHaveProperty("body", expect.any(String))
       expect(body.comment).toHaveProperty("comment_id", expect.any(Number))
       expect(body.comment).toHaveProperty("created_at", expect.any(String))
       expect(body.comment).toHaveProperty("votes", expect.any(Number))

        })
    })

    test("400:  Responds with msg 'Bad request' when passed an invalid id format", () => {
        const comment = {
            article_id: "one",
            username: "1",
            body: "3"
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400)
        .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      })
  })
})

describe("PATCH /api/articles/:article_id", () => {
    test("200: should increse the votes", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
         
          expect(body.article).toHaveProperty("article_id", 1);
          expect(body.article).toHaveProperty("votes", 201);
        })
    })

    test("200: should decrese the votes", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -100 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("article_id", 1);
          expect(body.article).toHaveProperty("votes", 100);
        })
    })
    test("400:  Responds with msg 'Bad request' when passed an invalid id format", () => {
        return request(app)
        .patch("/api/articles/notId")
        .send({ inc_votes: -100 })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request");
          })
    })



    test("404: responds with message' Not found' when passed a non existing ID", () => {
        return request(app)
        .patch("/api/articles/88")
        .send({ inc_votes: -100 })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found");
          })
    })
})


describe("DELETE /api/comments/:comment_id", () => {
    test("204, responds with an empty response body", () => {
      return request(app)
      .delete("/api/comments/2")
      .expect(204);
    });

    test("404: responds with message' Not found' when passed a non existing comment id", () => {
      return request(app)
        .delete("/api/comments/888888")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    test("400:  Responds with msg 'Bad request' when passed an invalid id format", () => {
      return request(app)
        .delete("/api/comments/notId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
const db = require(`${__dirname}/../../db/connection`)

const checkArticleExists = async (article_id) => {
    const dbOutput = await db.query(
      'SELECT * FROM articles WHERE article_id = $1;',
      [article_id]
    );
    if (dbOutput.rows.length === 0) {
     
      return Promise.reject({ status: 404, msg: 'Not found' });
    }
  };

exports.selectAllComments = (article_id,sort_by="created_at", order = "DESC") => {
    const sorted = ["created_at"]
    const ordered = ["ASC", "DESC"]
    order = order.toUpperCase()

  


    if(!sorted.includes(sort_by) || !ordered.includes(order)) {  
        return Promise.reject({status:400, msg: "Bad request"})

    }

    return checkArticleExists(article_id)
    .then(() => {
    return db.query(`SELECT comments.comment_id,
                            comments.body,
                            comments.votes,
                            comments.author,
                            comments.created_at,
                            comments.article_id
                            FROM comments
                            WHERE article_id = $1
                            ORDER BY ${sort_by} ${order}`, [article_id])

                            .then(({rows}) => {
                                return rows;
                            })
    })

                           

}
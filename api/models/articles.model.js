
const db = require("../../db/connection")

exports.selectArticle = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows})  => {
        if(rows.length === 0 ) {
            return Promise.reject({status: 404, msg: "Not found"})
        }

    return rows[0]
})  
}

exports.selectAllArticles = (sort_by="created_at", order = "DESC") => {
    const sorted = ["created_at", "votes", "topic"]
    const ordered = ["ASC", "DESC"]
    order = order.toUpperCase()

    if(!sorted.includes(sort_by) || !ordered.includes(order)) {  
        return Promise.reject({status:400, msg: "Bad request"})

    }
    return db.query(`SELECT articles.article_id,
                            articles.author,
                            articles.title,
                            articles.topic,
                            articles.created_at,
                            articles.votes,
                            articles.article_img_url,
                            COUNT(comments.comment_id) AS comment_count 
                            FROM articles
                            LEFT JOIN comments ON articles.article_id = comments.article_id
                            GROUP BY articles.article_id
                            ORDER BY articles.${sort_by} ${order}`)

                            .then(({rows}) => {
                                return rows;
                            })

}

exports.updateArticle =(article_id, inc_votes) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
                    [inc_votes, article_id])
                    .then(({ rows }) => {
                        if (rows.length === 0) {
                        return Promise.reject({status:400, msg: "Bad request"})
                                }

                     return rows[0]
                        });
                    };

                    
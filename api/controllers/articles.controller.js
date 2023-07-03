const{selectArticle, selectAllArticles} = require(`${__dirname}/../models/articles.model`)



exports.getAnArticle = (req,res,next) => {
    const {article_id} = req.params;
    selectArticle(article_id).then(articles => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
};

exports.getAllArticles = (req,res,next) => {
    const {sort_by, order} = req.query;
    selectAllArticles(sort_by, order).then(articles => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
};


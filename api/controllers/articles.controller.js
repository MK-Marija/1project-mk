const{selectArticle, selectAllArticles, updateArticle} = require("../models/articles.model")



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


exports.updateArticleById =(req,res,next) => {
   
    const {article_id} = req.params
    const {inc_votes} = req.body

    selectArticle(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

    const newVotes = article.votes + inc_votes;

    updateArticle(article_id,newVotes)
    .then((updatedArticle) => {
        res.status(200).send({ article: updatedArticle });
      })
    })
      .catch((err) => {
        next(err);
      });
  };



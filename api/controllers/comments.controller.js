
const{selectAllComments,insertComment} = require(`${__dirname}/../models/comments.model`)




exports.getAllComments = (req,res,next) => {
    const {sort_by, order} = req.query;
    const {article_id } = req.params;
    selectAllComments(article_id, sort_by, order).then(comments => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
};

exports.postComment = (req,res,next) => {
   
 
    const article_id = req.body.article_id
    const username = req.body.username
    const body = req.body.body
    insertComment(article_id,username,body).then
    ((comment) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
      
        next(err)
    });
    
}
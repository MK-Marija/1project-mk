
const{selectAllComments} = require(`${__dirname}/../models/comments.model`)




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
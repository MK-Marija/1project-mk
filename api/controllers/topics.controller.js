const{selectTopics} = require(`${__dirname}/../models/topics.model`)

exports.getTopics = (req,res) => {
    selectTopics().then(topics => {
        res.status(200).send({topics})

    })   
    
}


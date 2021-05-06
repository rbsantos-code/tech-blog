const router = require('express').Router();
const { Comment } = require('../../models');



// get all comments
router.get('/', (req, res) => {
    Comment.findAll({});
});


// create comment
router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        // use the id from the session
        user_id: req.session.user_id
    })
    .then(commentsData => res.json(commentsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
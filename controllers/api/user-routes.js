const router = require('express').Router();
const { User, Post, Comment  } = require('../../models');


// GET all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exlude: ['password'] }
    })
    .then(userData => res.json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// GET single user
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exlude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'body', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(userData => {
        if (!userData) {
            res.status(404).json({ message: 'no user found with this id' });
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// create user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(userData => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.json(userData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const { Post, sequelize } = require('../../db/models');
const { User } = require('../../db/models');
const session = require('express-session');

//api/posts
router
  .route('/')
  .get((req, res) => {
    const queryParams = Object.keys(req.query);

    switch (true) {
      case (queryParams.length !== 0 && !queryParams.includes('SearchInput') && !queryParams.includes('userid')):
          res.status(400).json({error: "wrond query parametrs" });
        break;

      case queryParams.includes('SearchInput') &&
        queryParams.includes('userid'):
        sequelize
          .query(
            `SELECT name, body, title, date FROM "Posts" as p JOIN "Users" as u ON p.user_id = u.id WHERE title LIKE '%${req.query.SearchInput}%' AND u.id = ${req.query.userid}`,
            {
              type: QueryTypes.SELECT,
            }
          )
          .then((allPosts) => res.json(allPosts))
          .catch((error) => res.status(500).json({ message: error.message }));
        break;

      case queryParams.includes('SearchInput'):
        sequelize
          .query(
            `SELECT name, body, title, date FROM "Posts" as p JOIN "Users" as u ON p.user_id = u.id WHERE title LIKE '%${req.query.SearchInput}%'`,
            {
              type: QueryTypes.SELECT,
            }
          )
          .then((allPosts) => res.json(allPosts))
          .catch((error) => res.status(500).json({ message: error.message }));
        break;

      case queryParams.includes('userid'):
        sequelize
          .query(
            `SELECT name, body, title, date FROM "Posts" as p JOIN "Users" as u ON p.user_id = u.id WHERE u.id = ${req.query.userid}`,
            {
              type: QueryTypes.SELECT,
            }
          )
          .then((allPosts) => res.json(allPosts))
          .catch((error) => res.status(500).json({ message: error.message }));
        break;
      default:
        sequelize
          .query(
            `SELECT name, body, title, date FROM "Posts" as p JOIN "Users" as u ON p.user_id = u.id`,
            {
              type: QueryTypes.SELECT,
            }
          )
          .then((allPosts) => console.log(allPosts))
          .catch((error) => res.status(500).json({ message: error.message }));
    }
  })
  .post((req, res) => {
    const { addPost, title, date } = req.body;
    let userid;
    if (req.session.userid) {
      userid = req.session.userid;
    }
    //add admin TOKEN!
    if (req.body.user_id) {
      userid = req.body.user_id;
    }

    if (addPost) {
      Post.create({ body: addPost, title: title, user_id: userid, date: date })
        .then((newPost) => res.json(newPost))
        .catch((error) => res.status(403).json({ message: error.message }));
    } else {
      res.status(400).json({ errr: 'field addPost empty' });
    }
  });

router
  .route('/:id')
  .put((req, res) => {
    const { id } = req.params;

    const { addPost, title, date } = req.body;

    if (addPost) {
      Post.update(
        { body: addPost, title: title, date: date },
        { where: { id: id }, raw: true, returning: true }
      )
        .then((updatedPost) => {
          const [, [updatedData]] = updatedPost;

          updatedPost[0] === 1
            ? res.json(updatedData)
            : res.status(500).json({ res: `cant UPDATE post with ${id}` });
        })
        .catch((error) => res.status(500).json({ message: error.message }));
    } else {
      res.status(400).json({ res: 'cant UPDATE post without body' });
    }
  })
  .delete((req, res) => {
    const { id } = req.params;
    Post.destroy({ where: { id } }).then((result) => {
      result === 1
        ? res.json({ id: +id, deleted: true })
        : res.status(400).json({ id: +id, deleted: false });
    });
  });

module.exports = router;

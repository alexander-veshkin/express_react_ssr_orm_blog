const express = require('express');
const router = express.Router();

const { checkAdmin } = require('../../lib/middleware/middleware.js');
const render = require('../../lib/render');
const Layout = require('../../views/Layout');

// root
router.get('/', (req, res) => {
  res.cookie('test', 42);
  render(
    Layout,
    {
      myTitle: 'Blog',
      doctType: true,
      userid: req.session.userid,
      username: req.session.userName,
    },
    res
  );
});

//test routes
router.get('/cookie', (req, res) => {
  res.cookie('cookieKey', 'hello)))', {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: false,
  });
  res.send('test');
});

router.get('/get', (req, res) => {
  console.log(req.url);
  res.json({ ttt: 'ttt' });
});

router.get('/session', (req, res) => {
  req.session.count++;
  res.json(req.session);
});

router.get('/admin', checkAdmin, (req, res) => {
  req.session.count++;
  res.json(req.session);
});

router.get('/clear', (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('user_sid');
    res.clearCookie('test');
    res.clearCookie('cookieKey');
    res.redirect('/');
  });
});

module.exports = router;

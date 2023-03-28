const session = require('express-session');
const FileStore = require('session-file-store')(session);

const sessionConfig = {
  name: 'user_sid', // имя куки для хранения сессии
  store: new FileStore(),
  secret: process.env.SESSION_SECRET ?? 'test',
  resave: false, // * если true, пересохранит сессию, даже если она не менялась
  saveUninitialized: false, // * если false, куки появятся только при установке req.session
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // * время жизни в мс (ms)
    httpOnly: true,
  },
};

module.exports = sessionConfig;


const session = require('express-session');
const sessionConfig = require('./sessionConfig');
const { sessionLog } = require('../lib/middleware/middleware');

const cookieParser = require('cookie-parser');

require('dotenv').config();

const serverConfig = (app) => {
  const express = require('express');
  const morgan = require('morgan');
  const path = require('path');

  app.use(morgan('dev'));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.json());
  // парсинг BODY от HTML-формы
  app.use(express.urlencoded({ extended: false }));

  app.use(cookieParser());
  app.use(session(sessionConfig));
  app.use(sessionLog);
};

module.exports = serverConfig;

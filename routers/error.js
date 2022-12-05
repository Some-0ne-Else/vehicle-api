const express = require('express');
const NotFoundError = require('../errors/not-found-err');

const router = express.Router();

router.all('/', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    name: 'Jack',
    password: '123456',
  });
});

module.exports = router;

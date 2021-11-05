var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) =>  {
  const { callback_name } = req.query;
  res.send(`${callback_name}('hello')`)
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) =>  {
  res.json({
    msg: 'get',
  })
});

router.post('/', (req, res) => {
  res.json({
    msg: 'post',
  })
})

router.put('/', (req, res) => {
  res.json({
    msg: 'put',
  })
})

module.exports = router;

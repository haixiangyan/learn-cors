var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) =>  {
  res.json({
    msg: 'index get',
  })
});

router.post('/', (req, res) => {
  res.json({
    msg: 'index post',
  })
})

router.put('/', (req, res) => {
  res.json({
    msg: 'index put',
  })
})

module.exports = router;
